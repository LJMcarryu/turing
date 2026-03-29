<script setup lang="ts">
const { formatDate } = useFormatDate()

useSeoMeta({
  title: 'Claude Code 完全指南：从安装到精通 — Turing',
  description: '详细介绍如何在 Windows、Linux 和 macOS 上安装和使用 Claude Code CLI',
})

const activePlatform = ref<'windows' | 'linux' | 'macos'>('windows')

const platforms = {
  windows: {
    icon: '⊞',
    name: 'Windows',
    shell: 'PowerShell',
    border: 'border-blue-500/40',
    bg: 'from-blue-500/15 to-cyan-500/10',
    glow: 'hover:shadow-blue-500/20',
    command: 'irm https://gist.githubusercontent.com/LJMcarryu/e06aa5d0875362133fb5eb3aa7649f50/raw/install-claude.ps1 | iex'
  },
  linux: {
    icon: '🐧',
    name: 'Linux',
    shell: 'Bash',
    border: 'border-yellow-500/40',
    bg: 'from-yellow-500/15 to-orange-500/10',
    glow: 'hover:shadow-yellow-500/20',
    command: 'curl -fsSL https://gist.githubusercontent.com/LJMcarryu/c29ac66bb58b5cc59390277ad7ecec06/raw/install-claude.sh | bash'
  },
  macos: {
    icon: '',
    name: 'macOS',
    shell: 'Terminal',
    border: 'border-purple-500/40',
    bg: 'from-purple-500/15 to-pink-500/10',
    glow: 'hover:shadow-purple-500/20',
    command: 'curl -fsSL https://gist.githubusercontent.com/LJMcarryu/c29ac66bb58b5cc59390277ad7ecec06/raw/install-claude.sh | bash'
  }
}

const copied = ref(false)
const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    // Clipboard API not available or permission denied
  }
}

const models = [
  { icon: '🧠', name: 'Opus 4.6', desc: '最强大的模型', color: 'purple', features: ['复杂架构设计', '大规模重构', '深度代码分析'] },
  { icon: '⚡', name: 'Sonnet 4.6', desc: '平衡性能与速度', color: 'blue', features: ['日常开发任务', 'Bug 修复', '代码审查'] },
  { icon: '🚀', name: 'Haiku 4.5', desc: '极速响应', color: 'green', features: ['快速查询', '简单修改', '代码解释'] },
]

const commands = [
  { icon: '📝', cmd: '/commit', highlight: true },
  { icon: '🔍', cmd: '/review-pr', highlight: true },
  { icon: '⚡', cmd: '/fast', highlight: false },
  { icon: '🧠', cmd: '/model', highlight: false },
  { icon: '💾', cmd: '/memory', highlight: false },
  { icon: '❓', cmd: '/help', highlight: false },
  { icon: '🗑️', cmd: '/clear', highlight: false },
  { icon: '🚪', cmd: '/exit', highlight: false },
]

const faqs = [
  { q: 'Claude Code 会修改我的文件吗？', a: '默认 prompt 模式会在修改前询问确认。你可以随时用 git diff 查看更改，或 git restore 撤销。' },
  { q: 'API 调用会产生费用吗？', a: '是的，按 token 计费。可以用 claude usage 查看使用量。推荐日常任务使用 Sonnet 模型以节省成本。' },
  { q: '支持哪些编程语言？', a: '支持所有主流语言：JavaScript/TypeScript、Python、Go、Rust、Java、C/C++、Ruby、PHP、Swift、Kotlin 等。' },
  { q: '如何更新到最新版本？', a: '运行 npm update -g @anthropic-ai/claude-code 或重新运行安装脚本即可。' },
]

const openFaq = ref(-1)

const bugSteps = [
  { title: '运行测试', code: '> npm test\n✗ 3 tests failed in src/utils/validator.test.ts' },
  { title: 'Claude 分析', code: '> 帮我定位问题\n⚡ Found issue in src/utils/validator.ts:42\n  — regex missing Unicode support' },
  { title: '自动修复', code: '> 修复验证逻辑\n✓ Updated regex in validator.ts\n✓ Added Unicode flag /u' },
  { title: '验证通过', code: '> npm test\n✓ All 47 tests passed!' },
]

const chatMessages = [
  { role: 'user', text: '创建一个 React 组件 UserProfile，包含头像、姓名和简介' },
  { role: 'ai', text: '我来创建这个组件...', result: '✓ Created src/components/UserProfile.tsx\n✓ Added TypeScript interfaces\n✓ Included responsive styling' },
  { role: 'user', text: '给这个组件添加单元测试' },
  { role: 'ai', text: '好的，我来创建测试文件...', result: '✓ Created __tests__/UserProfile.test.tsx\n✓ Added 5 test cases\n✓ All tests passing ✓' },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-brand-bg via-brand-bg to-[#0a0a0f]">
    <!-- Container with better max-width -->
    <article class="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <!-- Back Link -->
      <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-sm text-brand-primary transition-colors hover:text-brand-accent">
        <span>←</span>
        <span>返回 Blog</span>
      </NuxtLink>

      <!-- ========== HERO ========== -->
      <div class="relative -mx-6 mt-12 overflow-hidden rounded-3xl border border-brand-primary/30 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] p-16 text-center shadow-2xl lg:-mx-8">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,158,255,0.15),transparent_60%)]" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.1),transparent_60%)]" />
        <div class="relative z-10">
          <p class="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">完全指南</p>
          <h1 class="bg-gradient-to-r from-brand-primary via-white to-brand-accent bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-6xl">
            Claude Code
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-brand-muted">
            交互式终端 AI 助手，让编程效率提升 10 倍
          </p>
          <div class="mt-6 flex items-center justify-center gap-4 text-sm text-brand-subtle">
            <span>{{ formatDate('2026-03-28') }}</span>
            <span>·</span>
            <span>15 min 阅读</span>
          </div>
        </div>
      </div>

    <!-- ========== WHAT IS ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">💫</span>
        <h2 class="text-3xl font-bold">什么是 Claude Code？</h2>
      </div>
      <p class="text-lg leading-relaxed text-brand-muted">
        Claude Code 是 Anthropic 官方推出的<strong class="text-brand-text">命令行 AI 编程助手</strong>，它不仅能聊天，更能直接操作你的代码库——读写文件、执行命令、管理 Git，真正成为你的编程伙伴。
      </p>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, i) in [
          { icon: '📝', text: '直接读写文件系统' },
          { icon: '🔧', text: '执行 Shell 命令' },
          { icon: '🧠', text: '智能理解项目结构' },
          { icon: '🔀', text: 'Git 深度集成' },
          { icon: '🌐', text: '支持所有主流语言' },
          { icon: '🐛', text: '自动调试定位 Bug' },
        ]" :key="i" class="group flex items-center gap-4 rounded-xl border border-brand-border bg-brand-card p-5 transition-all hover:scale-105 hover:border-brand-primary/50 hover:shadow-lg">
          <span class="text-3xl transition-transform group-hover:scale-110">{{ item.icon }}</span>
          <span class="text-sm font-medium text-brand-muted">{{ item.text }}</span>
        </div>
      </div>
    </section>

    <!-- ========== INSTALL ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">⚡</span>
        <h2 class="text-3xl font-bold">快速安装</h2>
      </div>
      <p class="text-lg text-brand-muted">选择你的操作系统，一键安装：</p>

      <!-- Platform Tabs -->
      <div class="mt-8 flex flex-wrap gap-3">
        <button
          v-for="(p, key) in platforms" :key="key"
          @click="activePlatform = key as 'windows' | 'linux' | 'macos'"
          :class="[
            'rounded-full px-6 py-3 text-sm font-semibold transition-all',
            activePlatform === key
              ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg shadow-brand-primary/30 scale-105'
              : 'border border-brand-border text-brand-muted hover:border-brand-primary/50 hover:text-brand-text'
          ]"
        >
          <span class="mr-2">{{ p.icon }}</span>
          <span>{{ p.name }}</span>
        </button>
      </div>

      <!-- Install Card -->
      <div
        :class="[
          'mt-6 overflow-hidden rounded-2xl border bg-gradient-to-br p-8 shadow-xl transition-all',
          platforms[activePlatform].border,
          platforms[activePlatform].bg,
          platforms[activePlatform].glow
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ platforms[activePlatform].icon }}</span>
            <div>
              <div class="font-bold text-brand-text">{{ platforms[activePlatform].name }}</div>
              <div class="text-sm text-brand-muted">{{ platforms[activePlatform].shell }}</div>
            </div>
          </div>
          <button
            @click="copy(platforms[activePlatform].command)"
            class="rounded-lg bg-white/10 px-4 py-2 text-sm text-brand-text transition hover:bg-white/20"
          >
            {{ copied ? '✓ 已复制' : '复制命令' }}
          </button>
        </div>

        <div class="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4">
          <code class="whitespace-nowrap text-sm text-brand-accent">{{ platforms[activePlatform].command }}</code>
        </div>
      </div>

      <!-- Manual Install -->
      <details class="mt-8 rounded-xl border border-brand-border bg-brand-card shadow-lg transition-all hover:border-brand-primary/50">
        <summary class="cursor-pointer p-6 font-semibold text-brand-text transition-colors hover:text-brand-primary">
          <span class="mr-2">🔧</span>
          手动安装（备选方案）
        </summary>
        <div class="border-t border-brand-border p-6">
          <pre class="overflow-x-auto rounded-lg bg-black/40 p-5 text-sm leading-relaxed text-brand-muted"><code>npm install -g @anthropic-ai/claude-code
# 或
yarn global add @anthropic-ai/claude-code
# 或
pnpm add -g @anthropic-ai/claude-code</code></pre>
        </div>
      </details>
    </section>

    <!-- ========== CONFIG ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">🎮</span>
        <h2 class="text-3xl font-bold">初始配置</h2>
      </div>

      <!-- Steps -->
      <div class="mt-10 space-y-0">
        <div v-for="(step, i) in [
          { title: '获取 API Key', desc: '访问 console.anthropic.com 注册并创建密钥' },
          { title: '配置密钥', code: 'claude config set apiKey YOUR_API_KEY_HERE' },
          { title: '验证安装', code: 'claude --version' },
        ]" :key="i" class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-sm font-bold text-white">
              {{ i + 1 }}
            </div>
            <div v-if="i < 2" class="mt-1 h-full w-0.5 bg-brand-border"></div>
          </div>
          <div class="flex-1 pb-8">
            <div class="font-bold text-brand-text">{{ step.title }}</div>
            <p v-if="step.desc" class="mt-1 text-sm text-brand-muted">{{ step.desc }}</p>
            <pre v-if="step.code" class="mt-2 overflow-x-auto rounded-lg bg-brand-card border border-brand-border p-3 text-sm text-brand-accent"><code>{{ step.code }}</code></pre>
          </div>
        </div>
      </div>

      <!-- Models -->
      <h3 class="mt-16 text-2xl font-bold">选择模型</h3>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <div
          v-for="m in models" :key="m.name"
          :class="[
            'rounded-xl border p-6 transition-all hover:scale-105',
            `border-${m.color}-500/40 bg-gradient-to-br from-${m.color}-500/15 to-${m.color}-500/5`
          ]"
          :style="{
            borderColor: m.color === 'purple' ? 'rgba(168,85,247,0.4)' : m.color === 'blue' ? 'rgba(59,130,246,0.4)' : 'rgba(34,197,94,0.4)',
            background: m.color === 'purple' ? 'linear-gradient(to bottom right, rgba(168,85,247,0.15), rgba(168,85,247,0.05))' : m.color === 'blue' ? 'linear-gradient(to bottom right, rgba(59,130,246,0.15), rgba(59,130,246,0.05))' : 'linear-gradient(to bottom right, rgba(34,197,94,0.15), rgba(34,197,94,0.05))'
          }"
        >
          <span class="text-3xl">{{ m.icon }}</span>
          <h4 class="mt-3 text-lg font-bold text-brand-text">{{ m.name }}</h4>
          <p class="text-sm text-brand-muted">{{ m.desc }}</p>
          <ul class="mt-3 space-y-1">
            <li v-for="f in m.features" :key="f" class="text-xs text-brand-subtle">✓ {{ f }}</li>
          </ul>
        </div>
      </div>

      <!-- Permission Modes -->
      <h3 class="mt-16 text-2xl font-bold">权限模式</h3>
      <div class="mt-8 space-y-4">
        <div v-for="(mode, i) in [
          { icon: '🛡️', name: 'Prompt 模式', tag: '推荐', desc: '每次操作前询问确认', border: 'border-green-500/40', bg: 'rgba(34,197,94,0.08)' },
          { icon: '⚠️', name: 'Auto 模式', tag: '谨慎', desc: '自动执行所有操作', border: 'border-yellow-500/40', bg: 'rgba(234,179,8,0.08)' },
          { icon: '👁️', name: 'Readonly 模式', tag: '', desc: '只读，不修改任何文件', border: 'border-blue-500/40', bg: 'rgba(59,130,246,0.08)' },
        ]" :key="i" :class="['flex items-center gap-4 rounded-xl border p-4', mode.border]" :style="{ backgroundColor: mode.bg }">
          <span class="text-2xl">{{ mode.icon }}</span>
          <div class="flex-1">
            <span class="font-bold text-brand-text">{{ mode.name }}</span>
            <span v-if="mode.tag" class="ml-2 text-xs text-brand-accent">({{ mode.tag }})</span>
            <p class="text-sm text-brand-muted">{{ mode.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== USAGE ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">🎯</span>
        <h2 class="text-3xl font-bold">基本使用</h2>
      </div>

      <!-- Chat Demo -->
      <h3 class="mt-12 text-2xl font-bold">对话示例</h3>
      <div class="mt-8 space-y-4">
        <div
          v-for="(msg, i) in chatMessages" :key="i"
          :class="[
            'rounded-2xl border p-4',
            msg.role === 'user'
              ? 'border-brand-primary/30 bg-gradient-to-r from-brand-primary/10 to-brand-accent/5'
              : 'border-brand-border/50 bg-brand-card'
          ]"
        >
          <div class="flex items-start gap-3">
            <span class="text-xl">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
            <div class="flex-1">
              <p class="text-sm text-brand-text">{{ msg.text }}</p>
              <pre v-if="msg.result" class="mt-2 rounded-lg bg-black/30 p-3 text-xs text-green-400"><code>{{ msg.result }}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Commands Grid -->
      <h3 class="mt-16 text-2xl font-bold">内置斜杠命令</h3>
      <div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div
          v-for="c in commands" :key="c.cmd"
          :class="[
            'rounded-xl border p-4 text-center font-mono text-sm transition-all hover:scale-105',
            c.highlight
              ? 'border-brand-primary/40 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 text-brand-primary'
              : 'border-brand-border bg-brand-card text-brand-muted'
          ]"
        >
          <span class="text-xl">{{ c.icon }}</span>
          <div class="mt-1">{{ c.cmd }}</div>
        </div>
      </div>
    </section>

    <!-- ========== ADVANCED ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">🚀</span>
        <h2 class="text-3xl font-bold">高级功能</h2>
      </div>

      <!-- Multi-file -->
      <div class="mt-10 rounded-2xl border border-brand-primary/30 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 p-8 shadow-xl">
        <h3 class="text-lg font-bold text-brand-text">多文件编辑</h3>
        <p class="mt-1 text-sm text-brand-muted">一次性重构整个项目，保持一致性</p>
        <div class="mt-4 space-y-2">
          <div v-for="f in [
            { file: 'src/components/Button.tsx', status: 'Modified' },
            { file: 'src/components/Input.tsx', status: 'Modified' },
            { file: 'src/styles/theme.ts', status: 'Modified' },
            { file: 'src/tests/theme.test.ts', status: 'Created' },
          ]" :key="f.file" class="flex items-center justify-between rounded-lg bg-black/20 p-3">
            <span class="font-mono text-sm text-brand-muted">📄 {{ f.file }}</span>
            <span class="text-xs text-green-400">{{ f.status }} ✓</span>
          </div>
        </div>
      </div>

      <!-- Git -->
      <div class="mt-6 rounded-2xl border border-brand-border bg-brand-card p-6">
        <h3 class="text-lg font-bold text-brand-text">Git 工作流集成</h3>
        <pre class="mt-4 overflow-x-auto rounded-lg bg-black/30 p-4 text-sm text-brand-muted"><code>> 创建新分支 feature/dark-mode 并实现暗色主题

<span class="text-green-400">✓ Created branch feature/dark-mode
✓ Added dark mode CSS variables
✓ Updated 12 components
✓ Committed: "feat: add dark mode support"
✓ Ready to push!</span></code></pre>
      </div>

      <!-- Search -->
      <div class="mt-6 rounded-2xl border border-brand-accent/30 bg-gradient-to-br from-brand-accent/10 to-brand-primary/5 p-6">
        <h3 class="text-lg font-bold text-brand-text">🔍 智能代码搜索</h3>
        <p class="mt-1 text-sm text-brand-muted">语义搜索，不只是文本匹配</p>
        <pre class="mt-4 overflow-x-auto rounded-lg bg-black/30 p-4 text-sm text-brand-muted"><code>Query:  <span class="text-brand-accent">"找到所有使用 useState 的组件"</span>
Result: <span class="text-green-400">Found 23 components across 8 directories</span></code></pre>
      </div>
    </section>

    <!-- ========== BEST PRACTICES ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">💡</span>
        <h2 class="text-3xl font-bold">最佳实践</h2>
      </div>
      <div class="mt-10 grid gap-8 md:grid-cols-2">
        <div class="rounded-xl border border-green-500/40 p-6" style="background: rgba(34,197,94,0.08)">
          <h3 class="text-lg font-bold text-brand-text">✅ 好的做法</h3>
          <ul class="mt-3 space-y-2 text-sm text-brand-muted">
            <li><strong class="text-brand-text">具体明确</strong> — 说清楚文件名和功能</li>
            <li><strong class="text-brand-text">提供上下文</strong> — 背景和预期结果</li>
            <li><strong class="text-brand-text">分步执行</strong> — 复杂任务拆成小步骤</li>
            <li><strong class="text-brand-text">善用历史</strong> — 利用对话上下文</li>
          </ul>
        </div>
        <div class="rounded-xl border border-yellow-500/40 p-6" style="background: rgba(234,179,8,0.08)">
          <h3 class="text-lg font-bold text-brand-text">⚠️ 安全建议</h3>
          <ul class="mt-3 space-y-2 text-sm text-brand-muted">
            <li>用 <code class="rounded bg-black/30 px-1.5 py-0.5 text-brand-accent">.claudeignore</code> 排除敏感文件</li>
            <li>提交前检查 <code class="rounded bg-black/30 px-1.5 py-0.5 text-brand-accent">git diff</code></li>
            <li>生产环境用 <strong class="text-brand-text">readonly</strong> 模式</li>
            <li>API Key 不要提交到代码库</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ========== CASE STUDY ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">🎬</span>
        <h2 class="text-3xl font-bold">实战案例：修复 Bug</h2>
      </div>

      <div class="mt-10 rounded-2xl border border-brand-border bg-brand-card p-8 shadow-xl">
        <p class="text-sm text-brand-muted">🐛 场景：测试失败，需要定位并修复</p>
        <div class="mt-6 space-y-0">
          <div v-for="(step, i) in bugSteps" :key="i" class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-xs font-bold text-white">
                {{ i + 1 }}
              </div>
              <div v-if="i < bugSteps.length - 1" class="mt-1 h-full w-0.5 bg-brand-border"></div>
            </div>
            <div class="flex-1 pb-6">
              <div class="font-bold text-brand-text">{{ step.title }}</div>
              <pre class="mt-2 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-brand-muted"><code>{{ step.code }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== ADVANCED TIPS ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">🔥</span>
        <h2 class="text-3xl font-bold">进阶技巧</h2>
      </div>

      <div class="mt-10 grid gap-8 md:grid-cols-2">
        <div class="rounded-xl border border-brand-border bg-brand-card p-6">
          <h3 class="text-lg font-bold text-brand-text">💻 VS Code 集成</h3>
          <p class="mt-1 text-sm text-brand-muted">快捷键 Ctrl+Shift+C 唤起 Claude</p>
          <pre class="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-brand-accent"><code>code --install-extension anthropic.claude-code</code></pre>
        </div>
        <div class="rounded-xl border border-brand-border bg-brand-card p-6">
          <h3 class="text-lg font-bold text-brand-text">🧰 JetBrains 集成</h3>
          <p class="mt-1 text-sm text-brand-muted">支持 IntelliJ, PyCharm, WebStorm</p>
          <p class="mt-3 text-xs text-brand-accent">Settings → Plugins → Claude Code</p>
        </div>
      </div>

      <div class="mt-6 rounded-xl border border-brand-border bg-brand-card p-6">
        <h3 class="text-lg font-bold text-brand-text">CI/CD 集成</h3>
        <p class="mt-1 text-sm text-brand-muted">在 GitHub Actions 中自动审查 PR</p>
        <pre class="mt-3 overflow-x-auto rounded-lg bg-black/30 p-4 text-xs text-brand-muted"><code>name: Claude Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Claude Review
        env:
          ANTHROPIC_API_KEY: $&#123;&#123; secrets.ANTHROPIC_API_KEY &#125;&#125;
        run: |
          npm install -g @anthropic-ai/claude-code
          claude review-pr</code></pre>
      </div>
    </section>

    <!-- ========== FAQ ========== -->
    <section class="mt-24">
      <div class="mb-8 flex items-center gap-3">
        <span class="text-3xl">📚</span>
        <h2 class="text-3xl font-bold">常见问题</h2>
      </div>
      <div class="mt-10 space-y-4">
        <div
          v-for="(faq, i) in faqs" :key="i"
          class="rounded-xl border border-brand-border bg-brand-card transition-all hover:border-brand-primary/50"
        >
          <button @click="openFaq = openFaq === i ? -1 : i" class="flex w-full items-center justify-between p-5 text-left">
            <span class="font-bold text-brand-text">{{ faq.q }}</span>
            <span class="ml-4 text-brand-muted transition-transform" :class="{ 'rotate-180': openFaq === i }">▼</span>
          </button>
          <div v-if="openFaq === i" class="border-t border-brand-border p-5 text-sm text-brand-muted">
            {{ faq.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- ========== CTA ========== -->
    <section class="relative -mx-6 mt-32 overflow-hidden rounded-3xl border border-brand-primary/40 bg-gradient-to-br from-brand-primary/10 via-brand-accent/5 to-brand-bg p-16 text-center shadow-2xl lg:-mx-8">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,158,255,0.1),transparent_70%)]" />
      <div class="relative z-10">
        <div class="text-6xl">🚀</div>
        <h2 class="mt-6 text-3xl font-bold">开始你的 AI 编程之旅</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-brand-muted">
          Claude Code 不仅是一个工具，更是你的编程伙伴。让你专注于创造而非重复劳动。
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <a href="https://docs.anthropic.com/claude/docs/claude-code" target="_blank" rel="noopener noreferrer" class="btn-primary inline-flex items-center gap-2">
            <span>📖</span>
            <span>官方文档</span>
          </a>
          <a href="https://github.com/anthropics/claude-code" target="_blank" rel="noopener noreferrer" class="btn-primary inline-flex items-center gap-2">
            <span>💻</span>
            <span>GitHub</span>
          </a>
          <NuxtLink to="/newsletter" class="btn-primary inline-flex items-center gap-2">
            <span>📬</span>
            <span>订阅更新</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </article>
  </div>
</template>
