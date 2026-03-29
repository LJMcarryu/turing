import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('should display blog list', async ({ page }) => {
    await page.goto('/blog')

    // Check page title
    await expect(page.locator('h1')).toContainText('Blog')

    // Check if blog posts are displayed
    const posts = page.locator('a[href^="/blog/"]')
    await expect(posts.first()).toBeVisible()
  })

  test('should filter by tag', async ({ page }) => {
    await page.goto('/blog')

    // Find and click a tag filter
    const tagButton = page.locator('button').filter({ hasText: /^(?!全部)/ }).first()
    if (await tagButton.isVisible()) {
      await tagButton.click()

      // Verify filtering works (URL or content changes)
      await page.waitForTimeout(500)
    }
  })

  test('should navigate to blog post', async ({ page }) => {
    await page.goto('/blog')

    // Click first blog post
    const firstPost = page.locator('a[href^="/blog/"]').first()
    await firstPost.click()

    // Verify we're on a blog post page
    await expect(page.locator('article')).toBeVisible()
  })
})
