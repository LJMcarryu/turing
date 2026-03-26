export default defineAppConfig({
  site: {
    name: 'Turing',
    slogan: 'AI 技术实践者的知识库与工具箱',
    author: 'Jimmy Liu',
  },
  nav: [
    { label: 'Learn', to: '/learn' },
    { label: 'Projects', to: '/projects' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
  ],
  social: {
    github: 'https://github.com/jmliu6',
  },
})
