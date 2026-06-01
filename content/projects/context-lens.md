---
title: 'Context Lens'
description: '给 RAG 与长上下文一双眼睛 — 可视化每一个 token 实际进了模型的哪一格。'
github: 'https://github.com/jmliu6/context-lens'
date: '2026-03-30'
tags: [rag, context, debugging, observability]
status: wip
---

# Context Lens

检索回来一堆片段、拼了个长 prompt，模型却答非所问。问题出在哪一段？Context Lens 让你看见。

## 它做什么

- **上下文可视化**：把最终送进模型的上下文按来源分块染色
- **召回归因**：每个片段为什么被检索到、相关性分数多少
- **预算审计**：哪些 token 在白占窗口，哪些被截断丢了

## 一句话

把「上下文工程」从玄学变成可观测的工程问题。

> 🚧 WIP：核心可视化已能用，自动诊断建议在做。
