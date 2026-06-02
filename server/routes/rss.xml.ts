import { applySpec } from '#shared/content/apply'
import { mergeFeed } from '#shared/content/predicates'
import { buildBlogSpec, buildLearnSpec } from '#shared/content/spec'
import { queryCollection } from '@nuxt/content/server'
import { defineEventHandler, setResponseHeader } from 'h3'

const AMPERSAND_RE = /&/g
const DOUBLE_QUOTE_RE = /"/g
const GREATER_THAN_RE = />/g
const LESS_THAN_RE = /</g

function escapeXml(str: string): string {
  return str
    .replace(AMPERSAND_RE, '&amp;')
    .replace(LESS_THAN_RE, '&lt;')
    .replace(GREATER_THAN_RE, '&gt;')
    .replace(DOUBLE_QUOTE_RE, '&quot;')
}

function cdata(str: string): string {
  return `<![CDATA[${str.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`
}

export default defineEventHandler(async (event) => {
  const learn = await applySpec(queryCollection(event, 'learn'), buildLearnSpec({ limit: 20 })).all()
  const blog = await applySpec(queryCollection(event, 'blog'), buildBlogSpec({ limit: 20 })).all()

  const allItems = mergeFeed([learn, blog], 20)

  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string) || 'https://jmliu6.com'

  const rssItems = allItems
    .map(item => `
    <item>
      <title>${cdata(item.title)}</title>
      <link>${escapeXml(`${siteUrl}${item.path}`)}</link>
      <description>${cdata(item.description)}</description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <guid>${escapeXml(`${siteUrl}${item.path}`)}</guid>
    </item>`)
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Turing</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>AI 技术实践者的知识库与工具箱</description>
    <language>zh-CN</language>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return rss
})
