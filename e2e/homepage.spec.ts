import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check title
    await expect(page).toHaveTitle(/Turing/)

    // Check hero section
    await expect(page.locator('h1')).toContainText('Turing')

    // Check navigation
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/')

    // Click blog link
    await page.click('text=博客')

    // Verify URL
    await expect(page).toHaveURL(/\/blog/)

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
