/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 允许访问后端 API
  async rewrites() {
    return []
  },
  // 禁用图片优化（使用静态图片）
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
