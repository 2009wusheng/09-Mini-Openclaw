'use client'

import { useRef, useEffect } from 'react'
import { useApp } from '@/lib/store'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import ContextWarningBanner from './ContextWarningBanner'

export default function ChatPanel() {
  const { messages, currentSessionId, contextWarning, dismissContextWarning } = useApp()
  const bottomRef = useRef<HTMLDivElement>(null)
  
  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  return (
    <div className="h-full flex flex-col bg-apple-gray">
      {/* 上下文窗口告警 */}
      {contextWarning && (
        <div className="px-3 md:px-4 pt-2">
          <div className="max-w-4xl mx-auto">
            <ContextWarningBanner
              status={contextWarning.status}
              usageRatio={contextWarning.usage_ratio}
              message={contextWarning.message}
              onDismiss={dismissContextWarning}
            />
          </div>
        </div>
      )}
      
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        {!currentSessionId ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-center px-4 mb-8">
              <div className="mb-4">
                <img src="/welcome.jpg" alt="Welcome" className="w-24 h-24 md:w-32 md:h-32 mx-auto object-contain rounded-full" />
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: '"Comic Sans MS", "圆体", "幼圆", cursive, sans-serif', letterSpacing: '0.05em', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>老大，今天有什么可以帮到你的？</div>
            </div>
            {/* 默认页面的输入框 */}
            <div className="w-full max-w-4xl px-4">
              <ChatInput />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl mb-4">💬</div>
              <div className="text-sm md:text-base">发送消息开始对话</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* 输入框 - 有会话时显示在底部 */}
      {currentSessionId && (
        <div className="border-t border-apple-border bg-white dark:bg-slate-800 p-3 md:p-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput />
          </div>
        </div>
      )}
    </div>
  )
}
