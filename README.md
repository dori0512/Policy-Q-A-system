# PolicyPilot — 政策智能问答系统

[![TypeScript](https://img.shields.io/badge/TypeScript-React-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![RAG](https://img.shields.io/badge/RAG-Milvus%20%2B%20Ollama-orange)](#系统架构)
[![LLM](https://img.shields.io/badge/LLM-DeepSeek--R1-1E293B)](#技术栈)

基于 **RAG（检索增强生成）** 的政府政策智能问答系统：自然语言提问 → 向量 + 关键词混合检索 → 重排序 → 大模型作答，并附上**可点击的政策来源**。

适合作为「本地可跑的 RAG 全栈作品」：前后端分离、JWT 会话、Milvus 向量库、Ollama 本地模型，一条链路讲清楚检索与生成如何协作。

## ✨ 功能特性

- **🤖 AI 智能问答** — 基于 DeepSeek-R1 大模型，回答政策相关问题
- **📄 RAG 检索增强** — 结合向量检索 + 关键词匹配 + 重排序，精准定位相关政策
- **🔗 来源可溯** — 每个回答附有政策原文链接，结果可验证
- **💬 会话管理** — 多轮对话，支持切换/新建会话，历史记录持久化
- **🔐 用户认证** — JWT 认证，注册/登录，会话安全

## 🏗️ 系统架构

```
用户提问
    │
    ├── ① 保存用户消息到 MySQL
    │
    ├── ② Ollama Embedding 模型 (nomic-embed-text) → 384维向量
    │
    ├── ③ Ollama LLM (deepseek-r1:8b) → 提取政策关键词
    │
    ├── ④ Milvus 混合检索
    │      ├── 向量相似度搜索 (IP, top 20)
    │      └── 关键词过滤 (doc_content LIKE %keyword%)
    │
    ├── ⑤ 重排序 (bge-reranker-large)
    │
    ├── ⑥ 混合分数融合 → 取 top 5
    │
    ├── ⑦ 构建上下文提示词 + 用户问题
    │
    ├── ⑧ DeepSeek-R1 生成回答
    │
    └── ⑨ 返回带来源引用的回答
```

## 🛠️ 技术栈

### 后端

| 技术 | 用途 |
|------|------|
| **Node.js + Express** | 后端框架 |
| **MySQL** | 关系型数据库（用户、会话、消息） |
| **Milvus** | 向量数据库（政策文档向量化存储） |
| **Ollama** | 本地 LLM & 嵌入服务 |
| **JWT** | 用户认证 |
| **bcryptjs** | 密码加密 |

### 前端

| 技术 | 用途 |
|------|------|
| **React 19 + TypeScript** | 前端框架 |
| **Material UI 7** | UI 组件库 |
| **react-router-dom** | 路由 |
| **react-hook-form + yup** | 表单 & 校验 |
| **react-markdown** | 回答 Markdown 渲染 |
| **styled-components** | 样式管理 |

### AI 模型

| 模型 | 用途 |
|------|------|
| **deepseek-r1:8b** | 政策问答 & 关键词提取 |
| **nomic-embed-text** | 文本向量化（384维） |
| **bge-reranker-large** | 结果重排序 |

## 📁 项目结构

```
Policy-Q-A-system/
├── PolicyPilot-backend/          # Express 后端
│   ├── app.js                    # 入口文件
│   ├── dockerfile                # TEI 重排序服务 Docker 配置
│   ├── bin/www                   # 启动脚本
│   ├── routes/
│   │   ├── auth.js               # 认证路由
│   │   └── chat.js               # 对话路由（JWT 保护）
│   └── module/
│       ├── config/
│       │   ├── db.js             # MySQL 连接池
│       │   └── embedding.js      # 向量嵌入函数
│       ├── controllers/
│       │   ├── authController.js      # 注册/登录/验证
│       │   └── chatController.js      # RAG 核心管线
│       └── middlewares/
│           └── authMiddleware.js      # JWT 验证中间件
│
└── PolicyPilot-front/            # React 前端
    └── pliot/
        └── src/
            ├── App.tsx           # 根组件
            ├── pages/
            │   ├── Auth/         # 登录/注册页面
            │   └── ChatPage/     # 主对话页面
            ├── components/
            │   ├── Chat/         # ChatInput, ChatMessage, LoadingDots
            │   └── Layout/       # Sidebar, ProtectedRoute
            ├── contexts/         # AuthContext, ChatContext（全局状态）
            ├── services/         # API 封装 (axios)
            └── styles/           # 主题 & 全局样式
```

## 🚀 快速开始

### 前置依赖

- Node.js >= 18
- MySQL 8.0+
- [Ollama](https://ollama.com/) 已安装并运行
- [Milvus](https://milvus.io/) 向量数据库

### 1. 拉取 & 安装

```bash
# 克隆仓库
git clone git@github.com:dori0512/Policy-Q-A-system.git
cd Policy-Q-A-system

# 安装后端依赖
cd PolicyPilot-backend
npm install

# 安装前端依赖
cd ../PolicyPilot-front/pliot
npm install
```

### 2. 配置环境变量

在 `PolicyPilot-backend/` 下创建 `.env` 文件：

```env
# MySQL 配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=govpolicy

# JWT 密钥
JWT_SECRET=your_jwt_secret

# Ollama 服务地址
OLLAMA_URL=http://localhost:11436

# Milvus 配置
MILVUS_HOST=localhost
MILVUS_PORT=19530
```

### 3. 启动服务

```bash
# 启动后端（默认端口 8080）
cd PolicyPilot-backend
npm start

# 启动前端（新开终端，默认端口 3000）
cd PolicyPilot-front/pliot
npm start
```

### 4. 部署 AI 模型

确保 Ollama 已拉取所需模型：

```bash
ollama pull deepseek-r1:8b
ollama pull nomic-embed-text
ollama pull qllama/bge-reranker-large
```

> 重排序服务也可通过 Docker 运行（参见 `PolicyPilot-backend/dockerfile`）

## 🔧 环境要求

| 组件 | 版本/说明 |
|------|----------|
| Node.js | ≥ 18 |
| MySQL | 8.0+ |
| Milvus | 2.3+ |
| Ollama | 最新版 |
| 显存 | 建议 ≥ 8GB（运行本地 LLM） |

## 📝 使用说明

1. **注册账号** — 首次使用需注册邮箱账号
2. **登录系统** — 登录后进入对话界面
3. **开始问答** — 在输入框输入政策相关问题，如"北京市人才引进政策有哪些条件？"
4. **查看来源** — 每个回答下方附有政策原文链接，点击可查看详情
5. **管理会话** — 左侧边栏可切换/新建对话

## ⚠️ 注意事项

- 所有 AI 模型在本地运行，数据不出本机
- 政策数据需预先导入 Milvus 向量库
- 重排序为可选项，服务不可用时自动降级为向量分数排序

## 📄 开源协议

MIT License
