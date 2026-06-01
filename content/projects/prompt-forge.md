---
title: 'Prompt Forge'
description: '把提示词当代码管理 — 版本化、参数化、可评测的提示词工程工作台。'
github: 'https://github.com/jmliu6/prompt-forge'
date: '2026-04-20'
tags: [prompt-engineering, evals, typescript]
status: active
---

# Prompt Forge

提示词不该散落在代码字符串里。Prompt Forge 让你像管理代码一样管理提示词。

## 核心理念

- **版本化**：每条提示词是一个带 git 历史的文件，可 diff、可回滚
- **参数化**：用模板变量与片段复用，告别复制粘贴
- **可评测**：为每条提示词写断言用例，改完一键跑回归

## 工作流

1. 在 `prompts/` 下写提示词与变量
2. 用 `forge eval` 对一组用例打分
3. CI 里把评测当测试跑，提示词回归立刻拦住

## 为什么

模型一升级，旧提示词可能就退化。没有评测，你根本不知道。Prompt Forge 把「感觉变好了」变成「分数涨了 6 分」。
