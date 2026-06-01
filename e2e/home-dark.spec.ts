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

test('projects film list-view escape hatch works', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('button', { name: '列表视图' })
  await toggle.scrollIntoViewIfNeeded()
  await expect(toggle).toBeVisible()
  await toggle.click()
  await expect(page.getByRole('button', { name: '胶片视图' })).toBeVisible()
})

test('film strip drifts horizontally while page keeps scrolling (parallax, not pinned)', async ({ page }) => {
  await page.goto('/')
  const track = page.locator('.film-track').first()
  await track.waitFor({ state: 'visible' })
  await page.locator('.film').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  const y1 = await page.evaluate(() => window.scrollY)
  const t1 = await track.evaluate((el: HTMLElement) => getComputedStyle(el).transform)
  await page.mouse.wheel(0, 900)
  await page.waitForTimeout(700)
  const y2 = await page.evaluate(() => window.scrollY)
  const t2 = await track.evaluate((el: HTMLElement) => getComputedStyle(el).transform)
  expect(y2).toBeGreaterThan(y1) // 页面确实在滚动（没被 pin 住）
  expect(t2).not.toBe(t1) // 胶片横向漂移了
})
