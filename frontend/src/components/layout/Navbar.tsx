'use client'

import { ExternalLink, Menu, Sun, Moon } from 'lucide-react'
import { useApp } from '@/lib/store'

export default function Navbar() {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen, theme, toggleTheme } = useApp()
  
  return (
    <nav className="h-14 frosted-glass border-b border-apple-border flex items-center justify-between px-4 md:px-6 fixed top-0 left-0 right-0 z-50">
      {/* 左侧 Logo 和移动端菜单 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-klein-blue transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/50 shadow-lg">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              // 图片加载失败时显示默认笑脸
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-3xl">🐼</span>';
            }}
          />
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block bg-gradient-to-b from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent drop-shadow-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.2)' }}>09 Mini-Openclaw</span>
        <span className="font-semibold text-base text-gray-800 dark:text-gray-100 sm:hidden">OpenClaw</span>
      </div>
      
      {/* 右侧主题切换 + 链接 */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-klein-blue dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a
          href="https://github.com/2009wusheng/09-Mini-Openclaw"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-klein-blue dark:hover:text-blue-400 transition-colors"
        >
          2009wusheng
          <ExternalLink size={14} />
        </a>
      </div>
    </nav>
  )
}
