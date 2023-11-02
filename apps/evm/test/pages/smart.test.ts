import {
  Page,
  // NextFixture,
  expect,
  test,
} from 'next/experimental/testmode/playwright'
import { SupportedChainId } from 'src/config'
import { ChainId } from 'sushi/chain'
import { impersonateAccount } from 'test/erc20'

if (typeof process.env.NEXT_PUBLIC_CHAIN_ID !== 'string') {
  new Error('NEXT_PUBLIC_CHAIN_ID not set')
}
const BASE_URL = 'http://localhost:3000/pool'

const CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID as string,
) as SupportedChainId

test.beforeAll(async () => {
  test.skip(CHAIN_ID !== ChainId.POLYGON)

  const address = '0x23DefC2Ca207e7FBD84AE43B00048Fb5Cb4DB5B2'
  try {
    await impersonateAccount({
      chainId: CHAIN_ID,
      address,
    })
    console.log(`Impersonated account, ${address}`)
  } catch (error) {
    console.error(`Couldn't impersonate account, ${address}`, error)
  }
})

test.beforeEach(async ({ page, next }) => {
  page.on('pageerror', (error) => {
    console.error(error)
  })

  next.onFetch(() => {
    return 'continue'
  })
  await page.goto(BASE_URL)
  await switchNetwork(page, CHAIN_ID)
})

test('Create and remove smart pool position', async ({ page }) => {
  test.slow()
  // TODO: need to setup config to target specific pools depending on the network, however, the user need to change as well if more networks are added
  const poolId = '0x3361bf42cca22dc5fe37c7bd2c6a7284db440dfc'

  await page.goto(BASE_URL)
  await page.locator('[testdata-id=smart-pools-button]').click()

  const smartPoolRowLocator = page.locator(
    `[testdata-id=smart-pools-table-${poolId}]`,
  )
  await expect(smartPoolRowLocator).toBeVisible()
  await smartPoolRowLocator.click()

  // SAVEPOINT HERE
  await page.locator('[testdata-id=add-liquidity-token1-input]').fill('0.00001')

  const approveToken0Locator = page.locator(
    '[testdata-id=approve-erc20-0-button]',
  )
  await expect(approveToken0Locator).toBeVisible()
  await expect(approveToken0Locator).toBeEnabled()
  await approveToken0Locator.click()

  const approveToken1Locator = page.locator(
    '[testdata-id=approve-erc20-1-button]',
  )
  await expect(approveToken1Locator).toBeVisible()
  await expect(approveToken1Locator).toBeEnabled()
  await approveToken1Locator.click()
})

async function switchNetwork(page: Page, chainId: number) {
  const networkSelector = page.locator('[testdata-id=network-selector-button]')
  await expect(networkSelector).toBeVisible()
  await expect(networkSelector).toBeEnabled()
  await networkSelector.click()

  const networkToSelect = page.locator(
    `[testdata-id=network-selector-${chainId}]`,
  )
  await expect(networkToSelect).toBeVisible()
  await expect(networkToSelect).toBeEnabled()
  await networkToSelect.click()
}
