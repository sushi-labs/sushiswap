import { expect, test } from '../fixtures'

test.describe('agentic EVM seed', () => {
  test.skip(process.env.AGENTIC_RUN_MUTATING !== 'true')

  test('opens the chain swap page from isolated fork state', async ({
    agenticHarness,
    page,
    scenarioSnapshot: _scenarioSnapshot,
  }, testInfo) => {
    const chainId = testInfo.project.metadata.chainId
    await page.goto(`/${chainId}/swap`)
    await expect(page.locator('[testdata-id=swap-from-input]')).toBeVisible()
    expect(agenticHarness.controller.metadata?.chainId).toBe(chainId)
  })
})
