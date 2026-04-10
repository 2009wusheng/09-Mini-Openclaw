'use client'

import { X, ExternalLink, Globe, FileText, BookOpen } from 'lucide-react'
import { useApp } from '@/lib/store'

interface Reference {
  title: string
  url: string
  source?: string
  date?: string
}

interface ReferencesPanelProps {
  references: Reference[]
  onClose: () => void
}

export default function ReferencesPanel({ references, onClose }: ReferencesPanelProps) {
  const { theme } = useApp()

  const getIcon = (url: string) => {
    if (url.startsWith('http')) {
      return <Globe size={14} className="text-blue-500" />
    }
    if (url.includes('knowledge/') || url.includes('memory/')) {
      return <BookOpen size={14} className="text-purple-500" />
    }
    return <FileText size={14} className="text-gray-500" />
  }

  const formatSource = (ref: Reference) => {
    if (ref.source) return ref.source
    if (ref.url.startsWith('http')) {
      try {
        const url = new URL(ref.url)
        return url.hostname.replace(/^www\./, '')
      } catch {
        return '网页'
      }
    }
    return '本地文件'
  }

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
        onClick={onClose}
      />

      {/* 右侧面板 */}
      <div className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-blue-500" />
            <span className="font-medium text-gray-800 dark:text-gray-200">
              参考来源 ({references.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 来源列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {references.map((ref, idx) => (
            <a
              key={idx}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getIcon(ref.url)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatSource(ref)}
                  </span>
                  {ref.date && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {ref.date}
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-800 dark:text-gray-200 font-medium line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ref.title}
                </div>

                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 dark:text-gray-500">
                  <ExternalLink size={12} />
                  <span className="truncate">{ref.url.length > 40 ? ref.url.slice(0, 40) + '...' : ref.url}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400 text-center">
          点击条目可在新标签页打开
        </div>
      </div>
    </>
  )
}
