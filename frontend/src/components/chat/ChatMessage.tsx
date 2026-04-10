'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { User, Bot, FileText, Image as ImageIcon, Sparkles, Globe } from 'lucide-react'
import { Message } from '@/lib/store'
import ThoughtChain from './ThoughtChain'
import RetrievalCard from './RetrievalCard'
import StrategyIndicator from './StrategyIndicator'
import PlanView from './PlanView'
import ReferencesPanel from './ReferencesPanel'
import ThinkingProcess, { parseThinkingContent } from './ThinkingProcess'

interface Reference {
  title: string
  url: string
  source?: string
  date?: string
}

// Parse references from message content and tool calls
function parseReferences(message: Message): Reference[] {
  const references: Reference[] = []

  // Parse from tool calls (fetch_url)
  message.tool_calls?.forEach(call => {
    if (call.tool === 'fetch_url') {
      const url = call.tool_input?.url || call.input?.url
      if (url) {
        references.push({
          title: call.tool_output?.slice(0, 50) + '...' || url,
          url: url
        })
      }
    }
  })

  // Parse from content (markdown links in reference section)
  const refSectionMatch = message.content.match(/---\s*\n\*\*参考来源[：:]?\*\*([\s\S]*?)$/i)
  if (refSectionMatch) {
    const refLines = refSectionMatch[1].split('\n')
    refLines.forEach(line => {
      const match = line.match(/^\d*\.?\s*\[([^\]]+)\]\(([^)]+)\)\s*-?\s*(.*)?$/)
      if (match) {
        references.push({
          title: match[1].trim(),
          url: match[2].trim(),
          source: match[3]?.trim()
        })
      }
    })
  }

  // Remove duplicates
  return references.filter((ref, idx, arr) =>
    arr.findIndex(r => r.url === ref.url) === idx
  )
}

// Estimate thinking time from tool calls
function getThinkingTime(message: Message): number | undefined {
  if (!message.tool_calls || message.tool_calls.length === 0) return undefined
  const times = message.tool_calls
    .map(call => call.elapsed_time)
    .filter((t): t is number => t !== undefined)
  if (times.length === 0) return undefined
  return times.reduce((a, b) => a + b, 0) * 1000 // Convert to ms
}

interface ChatMessageProps {
  message: Message
}

// 递归提取 React children 中的所有文本内容
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (!children) return ''
  if (Array.isArray(children)) {
    return children.map(extractText).join('')
  }
  if (React.isValidElement(children) && children.props?.children) {
    return extractText(children.props.children)
  }
  return ''
}

// 检测是否包含 box-drawing 字符（ASCII art）
const BOX_DRAWING_REGEX = /[┌┐└┘├┤┬┴┼─│═║╔╗╚╝╠╣╦╩╬▼▲◀▶■□▪▫●○◆◇★☆→←↑↓↔↕]/

// HTML 净化配置：允许基本 HTML 标签，阻止危险标签和属性
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'a', 'b', 'i', 'em', 'strong', 'u', 's', 'del', 'ins',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div', 'sub', 'sup', 'mark', 'abbr',
    'details', 'summary',
    'dl', 'dt', 'dd',
    'img',
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    td: ['align', 'valign', 'colspan', 'rowspan'],
    th: ['align', 'valign', 'colspan', 'rowspan'],
    span: ['style'],
    code: ['className'],
    '*': ['className'],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https'],
  },
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [showReferences, setShowReferences] = useState(false)
  const references = parseReferences(message)
  const { thinking, answer } = parseThinkingContent(message.content)
  // For user messages: show the full content directly
  // For assistant messages: only show answer part (thinking shown separately in ThinkingProcess)
  const displayContent = isUser ? message.content : answer
  const thinkingTime = getThinkingTime(message)

  return (
    <div className={`flex gap-2 md:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* 头像和策略指示器 */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div
          className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-vibrant-orange' : 'bg-klein-blue'
          }`}
        >
          {isUser ? (
            <User size={14} className="md:w-4 md:h-4" />
          ) : (
            <img
              src="/logo.jpg"
              alt="AI"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // 图片加载失败时显示默认图标
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:w-4 md:h-4"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
              }}
            />
          )}
        </div>
        {/* 策略指示器 - 仅在助手消息且存在策略信息时显示 */}
        {!isUser && message.strategy && (
          <StrategyIndicator strategy={message.strategy} compact />
        )}
        {/* 技能匹配徽章 */}
        {!isUser && message.matchedSkill && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 mt-1">
            <Sparkles size={10} />
            <span>{message.matchedSkill.name}</span>
          </div>
        )}
      </div>
      
      {/* 消息内容 */}
      <div className={`flex-1 max-w-[85%] md:max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        {/* 规划视图 */}
        {!isUser && message.plan && (
          <PlanView plan={message.plan} />
        )}
        
        {/* 检索结果 */}
        {message.retrievals && message.retrievals.length > 0 && (
          <RetrievalCard retrievals={message.retrievals} />
        )}
        
        {/* 附件列表 */}
        {message.attachments && message.attachments.length > 0 && (
          <div className={`mb-2 flex flex-wrap gap-1 md:gap-2 ${isUser ? 'justify-end' : ''}`}>
            {message.attachments.map((att, index) => (
              <div
                key={`${att.path}-${index}`}
                className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm ${
                  isUser ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200'
                }`}
              >
                {att.type === 'image' ? (
                  <ImageIcon size={12} className="md:w-3.5 md:h-3.5 flex-shrink-0" />
                ) : (
                  <FileText size={12} className="md:w-3.5 md:h-3.5 flex-shrink-0" />
                )}
                <span className="truncate max-w-[120px] md:max-w-[180px]">{att.filename}</span>
                <span className="text-xs opacity-60 hidden sm:inline">
                  {att.size < 1024
                    ? `${att.size}B`
                    : att.size < 1024 * 1024
                    ? `${(att.size / 1024).toFixed(1)}KB`
                    : `${(att.size / 1024 / 1024).toFixed(1)}MB`}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* 思维链（工具调用）- 只在助手消息中显示 */}
        {!isUser && (
          <ThoughtChain toolCalls={message.tool_calls || []} />
        )}

        {/* 思考过程 - 只在助手消息且非流式或已完成时显示 */}
        {!isUser && thinking && (
          <ThinkingProcess
            content={message.content}
            isStreaming={message.isStreaming}
            elapsedTime={thinkingTime}
          />
        )}

        {/* 消息气泡 - AI 消息使用无框模式 */}
        <div
          className={`inline-block text-sm md:text-base ${
            isUser
              ? 'bg-klein-blue text-white rounded-tr-sm rounded-2xl p-2 md:p-3'
              : 'py-1'
          }`}
        >
          {/* Only show message content if we have actual answer (not just thinking) */}
          {!displayContent ? (
            /* No answer content yet - don't show anything in the main bubble */
            null
          ) : message.isStreaming && !message.content ? (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
            </div>
          ) : (
            <div className={`markdown-content ${isUser ? 'text-white' : 'text-gray-800 dark:text-gray-200'} max-w-full`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                components={{
                  pre({ children, ...props }) {
                    return (
                      <pre className="my-2 whitespace-pre overflow-x-auto" {...props}>
                        {children}
                      </pre>
                    )
                  },
                  code({ node, className, children, style, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !(node as any)?.properties?.className &&
                                     !String(children).includes('\n')

                    if (isInline) {
                      return (
                        <code
                          className={`${isUser ? 'bg-blue-700' : 'bg-gray-100 dark:bg-slate-700'} px-1 rounded`}
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    }

                    return (
                      <code className={`${className || ''} whitespace-pre`} {...props}>
                        {children}
                      </code>
                    )
                  },
                  p({ children }) {
                    const text = extractText(children)
                    const hasBoxDrawing = BOX_DRAWING_REGEX.test(text)

                    if (hasBoxDrawing) {
                      return (
                        <pre className="my-2 whitespace-pre overflow-x-auto bg-gray-800 text-gray-100 p-3 rounded-lg text-sm">
                          {children}
                        </pre>
                      )
                    }

                    return <p>{children}</p>
                  },
                  a({ children, ...props }) {
                    return (
                      <a
                        {...props}
                        className={`underline ${isUser ? 'text-blue-200' : 'text-klein-blue dark:text-blue-400'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    )
                  },
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* 流式状态指示器 */}
        {message.isStreaming && message.content && (
          <span className="inline-block w-2 h-4 bg-klein-blue animate-pulse ml-1" />
        )}

        {/* 参考来源按钮 - 只在非流式状态下显示 */}
        {!isUser && !message.isStreaming && references.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowReferences(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
            >
              <Globe size={12} className="text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300">
                {references.length} 个网页
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 参考来源面板 */}
      {showReferences && (
        <ReferencesPanel
          references={references}
          onClose={() => setShowReferences(false)}
        />
      )}
    </div>
  )
}
