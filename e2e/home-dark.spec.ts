import { expect, test } from '@playwright/test'

test('homepage renders dark theme root', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-theme="noir"]').first()).toBeVisible()
  await expect(page.locator('h1')).toContainText(/意图|intent/)
})

test('reduced-motion disables arc animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const arc = page.locator('.arc')
  if (await arc.count()) {
    await expect(arc).toHaveCSS('animation-name', 'none')
  }
})

test('projects reel keyboard escape hatch works', async ({ page }) => {
  await page.goto('/')
  const reel = page.locator('.reel')
  await reel.scrollIntoViewIfNeeded()
  await reel.focus()
  await page.keyboard.press('ArrowRight') // 不应抛错；卷宗推进
  await expect(page.getByRole('button', { name: /列表视图|放映视图/ })).toBeVisible()
})
