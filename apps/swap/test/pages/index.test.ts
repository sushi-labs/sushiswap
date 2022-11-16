import { expect, test } from '@playwright/test'

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test('Swap', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL as string)

  // await page.screenshot({ path: 'screenshot.png', fullPage: true })

  const logs: string[] = []
  page.on('console', (message) => {
    logs.push(message.text())
  })

  const connectWalletMenu = page.getByText('Connect Wallet')
  await expect(connectWalletMenu).toBeVisible()
  await connectWalletMenu.click()

  let swapButton = page.locator('button', { hasText: /Enter Amount/i })
  await expect(swapButton).not.toBeEnabled()

  const input0 = page.locator('#swap > div > div:nth-child(2) > div.relative.flex.items-center.gap-1 > input')
  await expect(input0).toBeVisible()

  await input0.fill('1')

  await timeout(2500)

  swapButton = page.locator('button', { hasText: /Swap/i })
  await expect(swapButton).toBeEnabled()

  await swapButton.click()

  await timeout(2500)

  // const swapButton = page.locator('button', { hasText: /Swap/i })

  await page.screenshot({ path: 'screenshot.png', fullPage: true })

  // console.log(logs)

  // await page.waitForSelector('button')
  // await waitFor(() => {}, { timeout: 10000 })

  // const swapButton = page.locator('button', { hasText: /Enter Amount/i })
  // await expect(swapButton).not.toBeEnabled()

  // const connectButton = page.locator('button', { hasText: /Connect Wallet/i })
  // console.log('connectButton', connectButton)
  // await expect(connectButton).toBeEnabled()

  // const sendTipButton = page.locator('button', { hasText: /send/i })
  // await expect(sendTipButton).not.toBeEnabled()

  // const connectButton = page.locator('button', { hasText: /mock/i })
  // await expect(connectButton).toHaveText(/mock/i)
  // await connectButton.click()

  // await expect(sendTipButton).toBeEnabled()
  // await sendTipButton.click()
  // await expect(page.locator('text=Transaction')).toHaveText(
  //   'Transaction pending…',
  // )

  // await expect(page.locator('text=Transaction')).toHaveText(
  //   'Transaction confirmed!',
  // )
})
