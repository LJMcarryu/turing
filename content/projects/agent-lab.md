---
title: 'Agent Lab'
description: '一个用来「拆」Agent 的实验框架 — 把规划、工具、记忆、评判拆成可替换的积木。'
github: 'https://github.com/jmliu6/agent-lab'
date: '2026-05-28'
tags: [agent, orchestration, evals]
status: wip
---

# Agent Lab

大多数 Agent 框架追求「开箱即用」，Agent Lab 追求「看得清、换得动」。

## 设计原则

把一个 Agent 拆成四块可替换的积木：

- **Planner** — 决定下一步做什么
- **Tools** — 能做什么
- **Memory** — 记得什么
- **Judge** — 怎么判断做对了

每一块都是独立接口，可以单独替换、单独评测。

## 现状

> 🚧 开发中。当前已可跑通「规划 → 工具 → 评判」的单轮闭环，多轮记忆与并行子 Agent 正在做。

## 适合谁

想搞清楚 Agent 内部到底怎么运转、而不是把它当黑箱调用的人。
