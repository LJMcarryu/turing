import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check title
    await expect(page).toHaveTitle(/Turing/)

    // Check hero section（暗黑改版后的封面大标题）
    await expect(page.locator('header')).toContainText('Turing')
    await expect(page.locator('h1')).toContainText('机器之思')

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
})
