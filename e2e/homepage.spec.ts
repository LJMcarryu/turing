import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check title
    await expect(page).toHaveTitle(/Turing/)

    // Check hero section
    await expect(page.locator('header')).toContainText('Turing')
    await expect(page.locator('h1')).toContainText(/AI 技术实践者|Knowledge Base/)

    // Check navigation
    await expect(page.locator('header nav').first()).toBeVisible()
  })

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/')

    // Click blog link
    await page.locator('header a[href$="/blog"]').first().click()

    // Verify URL
    await expect(page).toHaveURL(/\/(en-US\/)?blog/)

    // Check blog page loaded
    await expect(page.locator('h1')).toContainText('Blog')
  })

  test('should switch language', async ({ page }) => {
    await page.goto('/')

    // Find and click language switcher
    const langSwitcher = page.locator('button:has-text("EN")')
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click()

      // Verify URL changed to English
      await expect(page).toHaveURL(/\/en-US/)
    }
  })
})
