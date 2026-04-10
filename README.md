# 09 Mini-Openclaw

一个轻量级、全透明的 AI Agent 系统。强调文件驱动（Markdown/JSON 取代向量数据库）、指令式技能（而非 function-calling）、以及 Agent 全部操作过程的可视化。

**在线演示**: https://542009.best

---

## 特性

### 核心特性
- **文件即记忆 (File-first Memory)**：所有记忆以人类可读的 Markdown 文件形式存在
- **技能即插件 (Skills as Plugins)**：通过 SKILL.md 文件定义技能，拖入即用
- **透明可控**：所有操作过程对开发者完全透明
- **思考分离**：AI 的思考过程与最终回答分开显示，流式实时展示

### 多 Agent 协同
- **智能任务分发**：基于 LLM 的策略选择器，自动判断单 Agent 或多 Agent 协同执行
- **领域专家 Agent**：支持数据分析师、文档分析师等专业 Agent，根据任务类型智能分发
- **任务复杂度分析**：自动识别多步骤、跨领域任务，协调多个 Agent 协同工作
- **执行策略可视化**：前端实时展示当前使用的执行策略（单 Agent / 多 Agent）

### 前端交互体验
- **全新欢迎页面**：居中式布局，个性化欢迎语，直接输入即可创建会话
- **自定义 Logo**：支持自定义图片作为 Logo，支持圆形/圆角样式
- **流式对话控制**：支持实时停止正在进行的流式对话
- **主题切换**：支持亮色/暗色双主题模式，界面元素保持一致性
- **实时思维链展示**：展示 Agent 的思考过程、工具调用、检索结果等中间状态
- **在线代码编辑器**：集成 Monaco Editor，直接编辑 Memory/Skill 文件
- **对话数量限制**：最多同时进行 5 个对话，超出时友好提示

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 后端框架 | FastAPI + Uvicorn | 异步 HTTP + SSE 流式推送 |
| Agent 引擎 | LangChain 0.3.x | create_tool_calling_agent |
| LLM | OpenAI 兼容接口 | 支持 DeepSeek、OpenAI 等 |
| RAG | LlamaIndex Core | 向量检索 + BM25 混合搜索 |
| 策略选择器 | LLM-driven Dispatch | 智能判断单/多 Agent 执行策略 |
| 前端框架 | Next.js 14 | App Router + TypeScript |
| UI 框架 | Tailwind CSS | Apple 风格毛玻璃效果 + 暗色模式 |
| 状态管理 | React Context | 全局状态 + 主题切换 |
| 流式控制 | AbortController | SSE 流式对话的实时中断 |
| 代码编辑器 | Monaco Editor | 在线编辑 Memory/Skill 文件 |
| 部署 | Docker + Caddy | 容器化部署，自动 HTTPS |

---

## 项目结构

```
mini-openclaw/
├── backend/                # FastAPI + LangChain
│   ├── app.py              # 入口文件 (Port 8002)
│   ├── Dockerfile          # 后端 Docker 镜像
│   ├── config.py           # 全局配置
│   ├── api/                # API 路由层
│   ├── graph/              # Agent 核心逻辑
│   │   ├── coordinator.py      # 协同管理器
│   │   ├── task_executor.py    # 任务执行器
│   │   ├── task_dispatcher.py  # 任务分发器
│   │   ├── strategy_selector.py  # 策略选择器
│   │   └── hooks.py            # 生命周期钩子系统
│   ├── tools/              # 核心工具
│   ├── skills/             # Agent Skills
│   │   ├── agent-reach/        # 联网搜索技能
│   │   ├── pua/                # 高执行力模式
│   │   └── skill-creator/      # 技能创建指南
│   ├── workspace/          # Agent 工作空间
│   │   ├── SOUL.md             # 核心人格设定
│   │   ├── IDENTITY.md         # 自我认知
│   │   ├── USER.md             # 用户画像
│   │   └── AGENTS.md           # 行为准则
│   ├── memory/             # 记忆文件
│   ├── knowledge/          # 知识库文档
│   └── sessions/           # 会话存储
│
├── frontend/               # Next.js 14+
│   ├── Dockerfile          # 前端 Docker 镜像
│   ├── public/             # 静态资源
│   │   ├── logo.jpg            # Logo 图片
│   │   └── welcome.jpg         # 欢迎页图片
│   └── src/
│       ├── app/            # 页面
│       ├── components/     # UI 组件
│       │   ├── layout/     # 布局组件
│       │   ├── chat/       # 对话组件
│       │   │   ├── ThinkingProcess.tsx  # 思考过程展示
│       │   │   └── ThoughtChain.tsx     # 工具调用链
│       │   ├── agents/     # Agent 管理
│       │   └── editor/     # 编辑器
│       └── lib/            # 状态管理 & API
│
├── docker-compose.yml      # Docker Compose 配置
├── Caddyfile              # Caddy 反向代理配置
├── deploy.sh              # 部署脚本
├── start.sh               # 本地启动脚本
└── README.md
```

---

## 快速开始

### 方式一：Docker 部署（推荐用于生产环境）

```bash
# 1. 克隆项目
git clone https://github.com/2009wusheng/09-Mini-Openclaw.git
cd 09-Mini-Openclaw

# 2. 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env，填入你的 API Key

# 3. 执行部署
chmod +x deploy.sh
./deploy.sh
```

访问 https://your-domain.com

### 方式二：本地开发（Windows/Linux/Mac）

#### 1. 配置环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，填入 API Key：

```env
# Agent 主模型（兼容所有 OpenAI 接口风格的大模型）
OPENAI_CHAT_API_KEY=sk-xxx
OPENAI_CHAT_BASE_URL=https://api.deepseek.com/v1
OPENAI_CHAT_MODEL=deepseek-chat

# Embedding 模型（用于知识库 & RAG 检索）
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://openrouter.ai/api/v1
EMBEDDING_MODEL=openai/text-embedding-3-small
```

#### 2. 安装依赖

**后端**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**前端**
```bash
cd frontend
npm install
```

#### 3. 启动服务

**终端1 - 后端**
```bash
cd backend
python -m uvicorn app:app --port 8002 --host 0.0.0.0 --reload
```

**终端2 - 前端**
```bash
cd frontend
npm run dev
```

#### 4. 访问

- 前端: http://localhost:3001
- 后端 API: http://localhost:8002
- API 文档: http://localhost:8002/docs

---

## VPS 部署指南

### 使用 Docker Compose 部署

1. **准备 VPS**（推荐 Ubuntu 22.04+/Debian 12+）
2. **安装 Docker**
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

3. **上传项目文件**
   ```bash
   scp -r backend frontend docker-compose.yml Caddyfile deploy.sh root@your-vps-ip:/opt/mini-openclaw/
   ```

4. **执行部署**
   ```bash
   cd /opt/mini-openclaw
   chmod +x deploy.sh
   ./deploy.sh
   ```

5. **配置域名 DNS**
   - 将域名 A 记录指向 VPS IP
   - 如果使用 Cloudflare，关闭代理（灰色云）让 Caddy 自动申请 HTTPS 证书

### 部署后运维

```bash
# 查看日志
cd /opt/mini-openclaw
docker compose logs -f

# 重启服务
docker compose restart

# 更新部署（代码更新后）
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

## 核心工具

| 工具 | 名称 | 功能 |
|------|------|------|
| terminal | 终端 | 执行 Shell 命令（沙箱化） |
| python_repl | Python 解释器 | 执行 Python 代码 |
| fetch_url | 网络请求 | 获取网页内容 |
| read_file | 文件读取 | 读取项目内文件 |
| search_knowledge_base | 知识库搜索 | RAG 语义检索 |

---

## 技能系统

技能以 Markdown 文件形式存在于 `backend/skills/` 目录下。Agent 通过 `read_file` 工具读取 SKILL.md 来学习技能。

### 内置技能

| 技能 | 描述 | 触发关键词 |
|------|------|----------|
| **agent-reach** | 联网搜索，获取实时信息 | 搜索、网页、YouTube、B站、微博 |
| **pua** | 高执行力问题解决模式 | 加油、认真点、try harder |
| **skill-creator** | 创建新技能的指南 | 创建技能、新技能 |
| **pdf** | PDF 文件处理 | PDF、文档解析 |
| **docx** | Word 文档处理 | Word、.docx |
| **web-scraper** | 网页抓取 | 抓取、爬虫 |
| **code-reviewer** | 代码审查 | 代码审查、review |

### 添加新技能

1. 在 `backend/skills/` 下创建新目录
2. 创建 `SKILL.md` 文件，包含 YAML frontmatter：

```markdown
---
name: 技能名称
description: 技能描述
triggers: 关键词1,关键词2,关键词3
agent: primary_agent
tools: terminal,python_repl
priority: 10
---

# 技能说明

## 使用步骤

1. 第一步...
2. 第二步...
```

3. 重启后端服务，技能会自动加载

---

## API 接口

| 路径 | 方法 | 说明 |
|------|------|------|
| /api/chat | POST | SSE 流式对话 |
| /api/sessions | GET/POST | 会话列表/创建 |
| /api/sessions/{id} | PUT/DELETE | 重命名/删除会话 |
| /api/sessions/{id}/history | GET | 获取会话历史 |
| /api/files | GET/POST | 读取/保存文件 |
| /api/files/upload | POST | 文件上传 |
| /api/skills | GET | 列出技能 |
| /api/agents | GET | Agent 列表 |
| /api/agents/{name} | GET | Agent 详情 |
| /api/config/rag-mode | GET/PUT | RAG 模式配置 |
| /api/config/multi-agent-mode | GET/PUT | 多 Agent 模式配置 |

---

## 开发说明

### System Prompt 组成

System Prompt 由以下部分动态拼接：

1. `SKILLS_SNAPSHOT.md` - 可用技能清单
2. `workspace/SOUL.md` - 人格、语气、边界
3. `workspace/IDENTITY.md` - 名称、风格
4. `workspace/USER.md` - 用户画像
5. `workspace/AGENTS.md` - 操作指南 & 协议
6. `memory/MEMORY.md` - 跨会话长期记忆

### RAG 模式

启用 RAG 模式后，`MEMORY.md` 不再完整注入 System Prompt，而是通过语义检索动态注入相关片段。

### 多 Agent 协同机制

系统通过 `backend/graph/strategy_selector.py` 实现智能的任务分发策略：

**执行策略判断**：
- **单 Agent 执行**：简单对话、代码生成、翻译等单一任务
- **多 Agent 协同**：数据分析、文档处理、多步骤任务、跨领域任务

**领域专家分发**：
- `data_agent` - 数据处理、统计分析、可视化
- `doc_agent` - 文档解析、内容提取、格式转换
- `research_agent` - 研究搜索、信息收集
- `code_agent` - 代码编写、调试、优化
- `creative_agent` - 创意内容、设计

### 思考分离功能

系统通过正则表达式识别 AI 的思考过程（`[思考]` 或 `[Thinking]` 开头的内容），将其与最终回答分离展示：

- 思考过程显示在折叠面板中
- 支持步骤标记（如 `[步骤 1/3]`）自动格式化
- 实时流式显示思考过程

---

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

由 [2009wusheng](https://github.com/2009wusheng) 维护
