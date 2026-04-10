'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react'

interface ThinkingProcessProps {
  content: string
  isStreaming?: boolean
  elapsedTime?: number
}

// Stable line ID generator for consistent rendering
let lineIdCounter = 0

// Detect if a line is the start of the answer
function isAnswerStart(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false

  // Priority 1: Emoji headings - definite formatted answer start
  if (trimmed.match(/^[🎉📅📝📊🗓️✨⭐]/)) return true

  // Priority 2: Markdown headings
  if (trimmed.match(/^#+\s+/)) return true

  // Priority 3: "Here is the organized answer" patterns
  // Must include "整理了" + colon/comma to indicate actual delivery
  if (trimmed.match(/^根据查询结果，我为你整理了[：:]/)) return true
  if (trimmed.match(/^根据搜索结果，我为你整理了[：:]/)) return true
  if (trimmed.match(/^我为你整理了[：:]/)) return true

  // Priority 4: Direct answer with structure
  if (trimmed.match(/^最近的节日[是：:]/)) return true
  if (trimmed.match(/^今天是[：:]/)) return true
  if (trimmed.match(/^香港今天/)) return true

  // Priority 5: Summary markers
  if (trimmed.match(/^总结[：:]/)) return true
  if (trimmed.match(/^答[：:]/)) return true
  if (trimmed.match(/^回答[：:]/)) return true

  // NOT answer: transitional phrases that still explain thinking process
  // "根据我的知识..." - explaining reasoning
  // "根据查询结果..." without "整理了" - still transitional
  // "现在我知道..." - thinking process
  // "让我根据..." - thinking process

  return false
}

// Split content into thinking and answer parts
function splitThinkingAndAnswer(content: string): { thinking: string; answer: string } {
  const lines = content.split('\n')
  let answerStartIndex = -1

  // Find the first answer marker
  for (let i = 0; i < lines.length; i++) {
    if (isAnswerStart(lines[i])) {
      answerStartIndex = i
      break
    }
  }

  // No answer marker found - treat all as thinking if keywords present
  if (answerStartIndex === -1) {
    // Check if it looks like thinking content
    const thinkingKeywords = ['让我', '我来', '首先', '步骤', '搜索', '查询', '获取']
    const hasThinkingKeywords = thinkingKeywords.some(kw => content.includes(kw))
    
    if (hasThinkingKeywords) {
      return { thinking: content, answer: '' }
    }
    
    // No thinking keywords either - treat as answer
    return { thinking: '', answer: content }
  }

  // Split at the answer start
  const thinking = lines.slice(0, answerStartIndex).join('\n').trim()
  const answer = lines.slice(answerStartIndex).join('\n').trim()

  return { thinking, answer }
}

// Check if a line is a step marker like [步骤 1/4]
function isStepMarker(line: string): boolean {
  return line.trim().match(/^\[步骤\s+\d+\/\d+\]/) !== null
}

// Format a thinking line with bullet points
function formatThinkingLine(line: string): string {
  const trimmed = line.trim()
  if (!trimmed) return line

  // Don't add bullet to step markers - they are section headers
  if (isStepMarker(line)) {
    return line
  }

  // Already has formatting
  if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('[')) {
    return line
  }

  // Skip adding bullet to very short lines
  if (trimmed.length < 5) return line

  // Add bullet
  return '• ' + trimmed
}

export default function ThinkingProcess({ content, isStreaming, elapsedTime }: ThinkingProcessProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Split content
  const { thinking } = useMemo(() => splitThinkingAndAnswer(content), [content])

  // Only render if we have thinking content
  if (!thinking || thinking.length < 10) {
    return null
  }

  const formatTime = (ms?: number) => {
    if (!ms) return ''
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  // Process lines for display - filter out trailing empty lines during streaming
  const rawLines = thinking.split('\n')
  // Remove trailing empty lines to avoid premature empty lines during streaming
  let endIndex = rawLines.length
  if (isStreaming) {
    while (endIndex > 0 && rawLines[endIndex - 1].trim() === '') {
      endIndex--
    }
  }
  const filteredLines = rawLines.slice(0, endIndex)

  // Process lines and add spacing before step markers
  const thinkingLines: { text: string; id: number; formatted: string; isStep: boolean; addSpacing: boolean }[] = []

  // First pass: detect if we need to split lines that contain step markers inline
  const processedLines: string[] = []
  filteredLines.forEach((text) => {
    const stepMatch = text.match(/^(.*?)(\[步骤\s+\d+\/\d+\].*)$/)
    if (stepMatch && stepMatch[1].trim()) {
      // Line has content before step marker - split them
      processedLines.push(stepMatch[1])
      processedLines.push(stepMatch[2])
    } else {
      processedLines.push(text)
    }
  })

  processedLines.forEach((text, index) => {
    const isStep = isStepMarker(text)
    // Add spacing before step marker if it's not the first line
    const addSpacing = isStep && index > 0
    thinkingLines.push({
      text,
      id: lineIdCounter++,
      formatted: formatThinkingLine(text),
      isStep,
      addSpacing
    })
  })

  return (
    <div className="mb-3">
      {/* Thinking header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <Sparkles size={14} className="text-purple-500" />
        <span>已思考</span>
        {elapsedTime && (
          <span className="text-xs text-gray-400">(用时 {formatTime(elapsedTime)})</span>
        )}
        {isStreaming && (
          <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Thinking content */}
      {isExpanded && (
        <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-slate-700 text-sm text-gray-600 dark:text-gray-400">
          <div className="space-y-1">
            {thinkingLines.map((line, index) => {
              const trimmed = line.text.trim()
              const hasBullet = line.formatted.trim().startsWith('•')
              const isLastLine = index === thinkingLines.length - 1

              return (
                <div key={line.id}>
                  {/* Add spacing before step markers */}
                  {line.addSpacing && <div className="h-3" />}
                  <div className={`leading-relaxed ${line.isStep ? 'font-medium text-gray-700 dark:text-gray-300 mt-1' : ''}`}>
                    {hasBullet ? (
                      <span className="flex gap-2 items-baseline">
                        <span className="text-purple-400 flex-shrink-0">•</span>
                        <span className="flex-1">
                          {line.formatted.replace(/^•\s*/, '')}
                          {/* Show cursor at end of last line when streaming */}
                          {isLastLine && isStreaming && (
                            <span className="inline-block w-1 h-4 bg-purple-400 animate-pulse ml-0.5 align-middle" />
                          )}
                        </span>
                      </span>
                    ) : trimmed ? (
                      <span className="inline">
                        {line.text}
                        {/* Show cursor at end of last line when streaming */}
                        {isLastLine && isStreaming && (
                          <span className="inline-block w-1 h-4 bg-purple-400 animate-pulse ml-0.5 align-middle" />
                        )}
                      </span>
                    ) : (
                      /* Empty line - don't render during streaming to avoid premature spacing */
                      !isStreaming && <br />
                    )}
                  </div>
                </div>
              )
            })}
            {/* Show standalone cursor when streaming but no content yet */}
            {isStreaming && thinkingLines.length === 0 && (
              <div className="flex gap-2">
                <span className="text-purple-400 flex-shrink-0">•</span>
                <span className="inline-block w-1.5 h-4 bg-purple-400 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export utility function for use in ChatMessage
export function parseThinkingContent(content: string): { thinking: string; answer: string } {
  return splitThinkingAndAnswer(content)
}
