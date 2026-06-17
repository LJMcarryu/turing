<script setup lang="ts">
// 覆盖 @nuxt/content 默认的 <table> 渲染：包一层可横滚容器，
// 让宽表在窄屏横滚而非撑破阅读列；表格本身样式见 main.css 的 .prose table。
</script>

<template>
  <div class="prose-table-wrap">
    <table>
      <slot />
    </table>
  </div>
</template>
