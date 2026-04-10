# 长期记忆 (MEMORY)

这里存储着跨会话保持的重要信息。

## 系统信息

- **首次启动时间**: 2025-03-06
- **版本**: Mini-OpenClaw v1.0.1

## 用户偏好

- **PDF处理规则**: 当需要分析PDF文件时，必须使用PDF SKILL
- **联网搜索规则**: 当需要搜索网页、查看社交媒体、获取实时信息时，必须使用 Agent Reach SKILL


## 重要事件

- **2025-04-03**: 用户明确要求记住"当需要分析PDF文件时，使用PDF SKILL"规则
- **2025-04-08**: 安装并配置 Agent Reach SKILL，用于联网搜索和实时信息获取


## 学到的知识

### PDF SKILL 使用规则
1. **核心规则**: 当需要分析PDF文件时，必须使用PDF SKILL
2. **技能位置**: ./skills/pdf/SKILL.md
3. **主要功能**: 
   - 文本提取和内容分析
   - 表格数据提取
   - PDF合并、拆分、旋转
   - OCR处理（扫描PDF）
   - PDF创建和编辑
4. **常用工具库**:
   - pypdf: 基本PDF操作
   - pdfplumber: 文本和表格提取
   - reportlab: PDF创建
   - 命令行工具: pdftotext, qpdf, pdftk
5. **使用流程**:
   - 识别PDF处理需求
   - 读取PDF SKILL文件获取具体操作方法
   - 选择合适工具库
   - 执行操作并保存结果

### 技能调用协议
- 使用技能前必须先读取对应的SKILL.md文件
- 根据文件中的指示执行具体任务
- 使用内置工具（terminal, python_repl等）完成任务

### Agent Reach SKILL 使用规则
1. **核心规则**: 当需要联网搜索、获取实时信息、访问网页内容时，必须使用 Agent Reach SKILL
2. **技能位置**: ./skills/agent-reach/SKILL.md
3. **触发场景**:
   - 🔍 搜索信息：最新AI新闻、天气、股票价格
   - 📱 社交媒体：微博热搜、Twitter讨论、小红书推荐
   - 📹 视频平台：YouTube/B站/抖音视频分析
   - 🌐 网页内容：读取链接、分析网站
   - 💻 开发者工具：GitHub仓库、V2EX、RSS订阅
4. **基础工具**:
   - Jina Reader: 任意网页读取 `curl -s "https://r.jina.ai/https://example.com"`
   - yt-dlp: B站/YouTube视频信息获取
   - feedparser: RSS/Atom订阅解析
   - V2EX API: 直接调用
5. **使用流程**:
   - 识别需要联网获取信息的场景
   - 读取 Agent Reach SKILL 文件获取具体渠道配置
   - 选择合适工具执行查询
   - 整合结果并回答用户

### Skill Creator SKILL 使用规则
1. **核心规则**: 当用户想要创建新技能或更新现有技能时使用
2. **技能位置**: ./skills/skill-creator/SKILL.md
3. **功能**: 提供创建有效技能的完整指南，帮助扩展 Claude 的专业知识和工作流程能力
4. **使用流程**:
   - 读取 SKILL.md 获取创建指南
   - 按模板格式编写新的 SKILL.md 文件
   - 放置到 ./skills/{skill-name}/ 目录下

**参数说明**:


**天气代码对照**:


**查询其他城市**:


---

> 这个文件会随着使用不断更新，记录下重要的信息和经验。