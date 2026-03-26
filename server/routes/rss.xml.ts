import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const learn = await queryCollection(event, 'learn').order('date', 'DESC').limit(20).all()
  const blog = await queryCollection(event, 'blog').order('date', 'DESC').limit(20).all()

  const allItems = [...learn, ...blog]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)

  const siteUrl = 'https://jmliu6.com'

  const rssItems = allItems
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${siteUrl}${item.path}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <guid>${siteUrl}${item.path}</guid>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Turing</title>
    <link>${siteUrl}</link>
    <description>AI 技术实践者的知识库与工具箱</description>
    <language>zh-CN</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return rss
})
