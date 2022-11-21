import { expect, Page, test } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

test.beforeEach(async ({ page }) => {


})

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const swaps = [
  {
    token: {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
    },
    amount: '1',
  },
  // {
  //   token: {
  //     address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  //     symbol: 'DAI',
  //   },
  //   amount: '1',
  // },
  // {
  //   token: {
  //     address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //     symbol: 'USDT',
  //   },
  //   amount: '1',
  // },
  // {
  //   token: {
  //     address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  //     symbol: 'SUSHI',
  //   },
  //   amount: '1',
  // },
]
for (const swap of swaps) {
  test(`Swap NATIVE to ${swap.token.symbol} `, async ({ page }) => {
    await page.goto(process.env.PLAYWRIGHT_URL as string)

    const logs: string[] = []
    page.on('console', (message) => {
      logs.push(message.text())
    })

    await swapFromNative('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 'USDC', swap.amount, page)
  })

}

/**
 * NOTE: this searches for the token in the list, and selects it by testdata-id. It cannot select it directly
 * because the list is long and the desired token may be further down in the list, by searching for it the result is narrowed down and the correct token should be listed.
 * @param token
 * @param searchTerm
 * @param amount
 * @param page
 */
async function swapFromNative(token: string, searchTerm: string, amount: string, page: Page) {
  let swapButton = page.locator('button', { hasText: /Enter Amount/i })
  await expect(swapButton).not.toBeEnabled()

  const input0 = page.locator('#swap > div > div:nth-child(2) > div.relative.flex.items-center.gap-1 > input')
  await expect(input0).toBeVisible()
  await input0.fill(amount)

  // Open token list
  const tokenOutputList = page.getByTestId('token-output')
  expect(tokenOutputList).toBeVisible()
  await tokenOutputList.click()

  // Select token
  await page.fill('[placeholder="Search token by address"] >> visible=true', searchTerm)
  await page.locator(`[testdata-id=token-selector-row-${token}]`).click()

  swapButton = page.locator('button', { hasText: /Swap/i })
  await expect(swapButton).toBeEnabled()
  await swapButton.click()

  const confirmSwap = page.locator('div[role="dialog"] button:has-text("Swap")')
  await expect(confirmSwap).toBeEnabled()
  await confirmSwap.click()

  await expect(page.locator('text=Transaction Completed')).toHaveText('Transaction Completed')

  // await timeout(1000)
  // await page.screenshot({ path: `${searchTerm}-success.png` })
}

//  async function swapNative(token: string, searchTerm: string, amount: string, page: Page) {
//   let swapButton = page.locator('button', { hasText: /Enter Amount/i })
//   await expect(swapButton).not.toBeEnabled()

//   const input0 = page.locator('#swap > div > div:nth-child(2) > div.relative.flex.items-center.gap-1 > input')
//   await expect(input0).toBeVisible()
//   await input0.fill(amount)

//   // Open token list
//   const tokenOutputList = page.getByTestId('token-output')
//   expect(tokenOutputList).toBeVisible()
//   await tokenOutputList.click()

//   // Select token
//   await page.fill('[placeholder="Search token by address"] >> visible=true', searchTerm)
//   await page.locator(`[testdata-id=token-selector-row-${token}]`).click()

//   swapButton = page.locator('button', { hasText: /Swap/i })
//   await expect(swapButton).toBeEnabled()
//   await swapButton.click()

//   const confirmSwap = page.locator('div[role="dialog"] button:has-text("Swap")')
//   await expect(confirmSwap).toBeEnabled()
//   await confirmSwap.click()

//   await expect(page.locator('text=Transaction Completed')).toHaveText('Transaction Completed')

//   // await timeout(1000)
//   // await page.screenshot({ path: `${searchTerm}-success.png` })
// }
