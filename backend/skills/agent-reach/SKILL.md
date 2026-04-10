---
name: agent-reach
description: Agent Reach 互联网访问工具集。当用户需要搜索网页、查看社交媒体、获取实时信息、分析网页内容、读取YouTube/B站/小红书等平台内容时使用此技能。
triggers: 搜索,查询,最新,实时,天气,股票,Twitter,X,微博,小红书,YouTube,B站,网页,链接,URL,网页内容,抖音,GitHub,Reddit,新闻
agent: primary_agent
tools: terminal,python_repl,fetch_url
priority: 5
---

# Agent Reach 互联网访问工具

## 何时使用此技能

**⚠️ 当你需要以下信息时，必须使用此技能：**

| 场景 | 示例用户请求 |
|------|-------------|
| 🔍 **搜索信息** | "搜索最新的AI新闻"、"查一下今天的天气"、"比特币现在多少钱" |
| 📱 **社交媒体** | "看看微博上热搜"、"搜一下Twitter上关于这个的讨论"、"小红书有什么推荐" |
| 📹 **视频平台** | "这个YouTube视频讲了什么"、"分析一下B站这个视频"、"抖音这个视频怎么下载" |
| 🌐 **网页内容** | "读一下这个链接的内容"、"这个网站是做什么的"、"搜索相关的网页资料" |
| 💻 **开发者工具** | "查一下这个GitHub仓库"、"看看V2EX上怎么说"、"RSS订阅源更新了吗" |
| 📊 **实时数据** | "今天股市怎么样"、"最新的汇率是多少"、"现在几点了（不同时区）" |

> **简单判断**：如果用户问的是需要"上网查"才能得到的信息，就使用此技能！

Agent Reach 提供 AI Agent 访问互联网的能力，支持多种平台和信息源。

## 可用渠道

### 基础渠道（已安装）

| 平台 | 工具 | 用法示例 |
|------|------|---------|
| **任意网页** | Jina Reader | `curl -s "https://r.jina.ai/https://example.com"` |
| **RSS/Atom** | feedparser | `python -c "import feedparser; feedparser.parse('URL')"` |
| **V2EX** | API | 直接调用 V2EX API |
| **B站** | yt-dlp | `yt-dlp --dump-json URL` |

### 需要配置的渠道

#### Twitter/X 搜索和发帖
```bash
# 需要 Cookie 登录
agent-reach configure twitter-cookies "从Cookie-Editor导出的字符串"

# 使用
twitter search "关键词" -n 10
twitter timeline
```

#### Reddit 帖子和评论
```bash
# 安装 rdt-cli
pipx install rdt-cli

# 使用
rdt search "query"
rdt read POST_ID
```

#### 微信公众号文章
```bash
# 需要 mcporter + Exa MCP
npm install -g mcporter
mcporter config add exa https://mcp.exa.ai/mcp
```

#### 微博热搜和动态
```bash
# 使用 mcporter
mcporter call 'weibo.get_trendings(limit: 10)'
mcporter call 'weibo.search_weibo(keyword: "关键词", page: 1)'
```

#### 小红书笔记
```bash
# 安装 xhs-cli
pipx install xiaohongshu-cli
xhs login

# 或使用 mcporter（如果已配置）
mcporter call 'xiaohongshu.search_feeds(keyword: "关键词")'
```

#### 雪球股票行情
```bash
# 自动从浏览器提取 Cookie
agent-reach configure --from-browser chrome

# 或使用 Cookie-Editor 导入
agent-reach configure xueqiu-cookies "key1=val1; key2=val2"
```

#### 小宇宙播客转文字
```bash
# 需要 Groq API Key（免费）
agent-reach configure groq-key gsk_xxxxx

# 使用
bash ~/.agent-reach/tools/xiaoyuzhou/transcribe.sh https://www.xiaoyuzhoufm.com/episode/xxxxx
```

#### 抖音视频解析
```bash
# 安装 douyin-mcp-server
git clone https://github.com/yzfly/douyin-mcp-server.git ~/.agent-reach/tools/douyin-mcp-server
cd ~/.agent-reach/tools/douyin-mcp-server
pip install -e .
python run_http.py

# 注册到 mcporter
mcporter config add douyin http://localhost:18070/mcp
```

## 常用操作

### 读取任意网页
```bash
# 简单方式
curl -s "https://r.jina.ai/https://example.com"

# 带格式
curl -s "https://r.jina.ai/https://example.com" | cat
```

### 搜索 YouTube
```bash
# 使用 yt-dlp 搜索
yt-dlp "ytsearch10:关键词" --dump-json | jq -r '.title, .webpage_url'
```

### 读取 YouTube 视频信息
```bash
yt-dlp --dump-json "URL" | jq '{title, description, duration, uploader}'
```

### 搜索全网（Exa）
```bash
# 需要配置 mcporter + Exa
mcporter call 'exa.web_search_exa(query: "关键词", num_results: 10)'
```

### 读取 GitHub 仓库
```bash
# 使用 gh CLI
gh repo view owner/repo
gh search repos "关键词"
```

## 安装更多渠道

根据用户需求，安装特定渠道：

```bash
source ~/.agent-reach-venv/Scripts/activate

# 安装指定渠道
agent-reach install --env=auto --channels=twitter,weibo,xiaohongshu

# 安装所有渠道
agent-reach install --env=auto --channels=all
```

## 故障排查

### 检查所有渠道状态
```bash
agent-reach doctor
```

### 检查更新
```bash
agent-reach check-update
```

### 配置代理（中国大陆用户）
```bash
agent-reach configure proxy http://user:pass@ip:port
```

## 安全提示

1. **Cookie 安全**：使用 Cookie-Editor 插件导出，推荐用备用账号
2. **API Key**：小宇宙 Groq Key 免费且无需信用卡
3. **代理配置**：twitter-cli 和 rdt-cli 支持 HTTP_PROXY/HTTPS_PROXY 环境变量

## 参考

- Agent Reach 仓库：https://github.com/Panniantong/Agent-Reach
- 安装文档：https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md
