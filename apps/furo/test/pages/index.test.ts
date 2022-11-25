import { expect, test } from '@playwright/test'

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL as string)
})

test('Create a stream', async ({ page }) => {
  test.slow()
  page.on('pageerror', (err) => {
    console.log(err.message)
  })
  const createStreamLink = page.locator('[testdata-id=create-stream-button]')
  createStreamLink.click()
  // Expects the URL to contain intro.
  await expect(page).toHaveURL(process.env.PLAYWRIGHT_URL + '/stream/create')
})
