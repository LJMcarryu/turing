---
title: 'MCP Scaffold'
description: '一条命令生成生产级 MCP 服务器骨架 — 内置类型安全的工具定义、鉴权与可观测性。'
github: 'https://github.com/jmliu6/mcp-scaffold'
date: '2026-05-12'
tags: [mcp, typescript, cli, agent]
status: active
---

# MCP Scaffold

把搭建 Model Context Protocol 服务器的样板代码，压缩成一条命令。

## 解决什么问题

写一个 MCP 服务器，真正的业务逻辑往往只有几十行，剩下都是重复的样板：工具 schema 校验、错误包装、传输层、鉴权、日志。MCP Scaffold 把这些一次性给你配好。

## 特性

- **类型安全的工具定义**：用 Zod 描述参数，自动生成 JSON Schema 与运行时校验
- **三种传输开箱即用**：stdio / SSE / Streamable HTTP
- **内置可观测性**：每次工具调用的耗时、入参、结果都结构化落盘
- **鉴权中间件**：API Key 与 OAuth 两套现成方案

## 快速开始

```bash
npx mcp-scaffold init my-server
cd my-server && npm run dev
```

几秒钟后你就有一个能被 Claude 直接连上的服务器。
