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

test('projects reel scrolls horizontally on wheel (not hijacked by Lenis)', async ({ page }) => {
  await page.goto('/')
  const track = page.locator('.reel-track')
  await track.waitFor({ state: 'visible' })
  await track.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500) // 等页面平滑滚动惯性稳定
  const before = await track.evaluate((el: HTMLElement) => el.scrollLeft)
  await track.hover()
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(500)
  const after = await track.evaluate((el: HTMLElement) => el.scrollLeft)
  expect(after).toBeGreaterThan(before + 20)
})
