<template>
  <div class="flex min-h-screen flex-col bg-[var(--paper)]">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <TheCursor />
  </div>
</template>
