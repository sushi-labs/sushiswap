import { AddressZero } from '@ethersproject/constants'
import { Page, test, expect } from '@playwright/test'
import { USDC_ADDRESS, Native, Token, Type } from '@sushiswap/currency'

export async function approve(page: Page, locator: string) {
  await timeout(500) // give the approve button time to load contracts, unrealistically fast when running test
  const pageLocator = page.locator(`[testdata-id=${locator}]`)
  await expect(pageLocator).toBeEnabled({ timeout: 1500 }).then(async () => {
    await pageLocator.click({ timeout: 2500 })
  })
  .catch(() => console.log('already approved or not needed'))
}

interface V2PoolArgs {
  token0: Type
  token1: Type
  amount0: string
  amount1: string
  fee: string
  type: 'CREATE' | 'ADD'
}

interface V3PoolArgs {
  token0: Type
  token1: Type
  startPrice?: string
  minPrice: string
  maxPrice: string
  amount: string
  amountBelongsToToken0: boolean
  type: 'CREATE' | 'ADD'
}

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

const CHAIN_ID = parseInt(process.env.CHAIN_ID)
const NATIVE_TOKEN = Native.onChain(CHAIN_ID)
const USDC = new Token({
  chainId: CHAIN_ID,
  address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS],
  decimals: 18,
  symbol: 'USDC',
  name: 'USDC Stablecoin',
})

// Tests will only work for polygon atm
test.describe('V3', () => {
  test.beforeEach(async ({ page }) => {
    const url = (process.env.PLAYWRIGHT_URL as string).concat('/add').concat(`?chainId=${CHAIN_ID}`)
    await page.goto(url)
    await switchNetwork(page, CHAIN_ID)
  })

  test('Create pool', async ({ page }) => {
    test.slow()
    await createOrAddLiquidityV3(page, {
      token0: NATIVE_TOKEN,
      token1: USDC,
      startPrice: '0.5',
      minPrice: '0.1',
      maxPrice: '0.9',
      amount: '0.001',
      amountBelongsToToken0: false,
      type: 'CREATE',
    })
  })

  test('Add liquidity, both sides', async ({ page }) => {
    test.slow()
    await createOrAddLiquidityV3(page, {
      token0: NATIVE_TOKEN,
      token1: USDC,
      minPrice: '0.3',
      maxPrice: '0.7',
      amount: '0.0001',
      amountBelongsToToken0: false,
      type: 'ADD',
    })
  })

  test('Add liquidity, only one side(NATIVE)', async ({ page }) => {
    test.slow()
    await createOrAddLiquidityV3(page, {
      token0: NATIVE_TOKEN,
      token1: USDC,
      minPrice: '0.8',
      maxPrice: '0.9',
      amount: '1',
      amountBelongsToToken0: true,
      type: 'ADD',
    })
  })

  test('Add liquidity, only one side(USDC)', async ({ page }) => {
    test.slow()
    await createOrAddLiquidityV3(page, {
      token0: NATIVE_TOKEN,
      token1: USDC,
      minPrice: '0.2',
      maxPrice: '0.4',
      amount: '0.0001',
      amountBelongsToToken0: false,
      type: 'ADD',
    })
  })

  test('Remove liquidity', async ({ page }) => {
    test.slow()
    await removeLiquidityV3(page)
  })
})

// Tests will only work for polygon atm
test.describe('V2', () => {
  test.beforeEach(async ({ page }) => {
    const url = (process.env.PLAYWRIGHT_URL as string).concat(`/add/v2/${CHAIN_ID}`)
    await page.goto(url)
    await switchNetwork(page, CHAIN_ID)
  })

  test('Create pool', async ({ page }) => {
    test.slow()
    await createOrAddV2Pool(page, {
      // 0.01% fee is not created at block 42259027
      token0: NATIVE_TOKEN,
      token1: USDC,
      amount0: '0.0001',
      amount1: '0.0001',
      fee: '1',
      type: 'CREATE',
    })
  })

  test('Add, stake, unstake and remove', async ({ page }) => {
    test.slow()
    await createOrAddV2Pool(page, {
      token0: NATIVE_TOKEN,
      token1: USDC,
      amount0: '0.0001',
      amount1: '0.0001',
      fee: '5',
      type: 'ADD',
    })

    const addLiquidityUrl = (process.env.PLAYWRIGHT_URL as string).concat(
      '/137:0x846fea3d94976ef9862040d9fba9c391aa75a44b/add'
    )
    await page.goto(addLiquidityUrl, { timeout: 25_000 })
    await manageLiquidity(page, 'STAKE')

    const removeLiquidityUrl = (process.env.PLAYWRIGHT_URL as string).concat(
      '/137:0x846fea3d94976ef9862040d9fba9c391aa75a44b/remove'
    )
    await page.goto(removeLiquidityUrl, { timeout: 25_000 })
    await manageLiquidity(page, 'UNSTAKE')
    await page.reload({ timeout: 25_000 })
    await removeLiquidityV2(page)
  })
})

async function createOrAddLiquidityV3(page: Page, args: V3PoolArgs) {
  await handleToken(page, args.token0, 'FIRST')
  await handleToken(page, args.token1, 'SECOND')
  const feeOptionSelector = page.locator('[testdata-id=fee-option-10000]')
  await expect(feeOptionSelector).toBeEnabled()
  await feeOptionSelector.click()
  await expect(feeOptionSelector).toBeChecked()

  if (args.type === 'CREATE' && args.startPrice) {
    await page.locator('[testdata-id=start-price-input]').fill(args.startPrice)
  }
  await page.locator('[testdata-id=min-price-input]').fill(args.minPrice)
  await page.locator('[testdata-id=max-price-input]').fill(args.maxPrice)

  const tokenOrderNumber = args.amountBelongsToToken0 ? 0 : 1
  await page.locator(`[testdata-id=add-liquidity-token${tokenOrderNumber}-input]`).fill(args.amount)

  // if ((args.amountBelongsToToken0 && !args.token0.isNative) || (!args.amountBelongsToToken0 && !args.token1.isNative)) {
  await approve(page, `approve-erc20-${tokenOrderNumber}`)
  // }
  const previewLocator = page.locator('[testdata-id=add-liquidity-preview-button]')
  await expect(previewLocator).toBeVisible({ timeout: 10_000 })
  await expect(previewLocator).toBeEnabled()
  await previewLocator.click()
  await page.locator('[testdata-id=confirm-add-liquidity-button]').click({ timeout: 2_000 })

  const expectedText =
    args.type === 'ADD'
      ? `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`
      : `(Created the ${args.token0.symbol}/${args.token1.symbol} liquidity pool)`
  const regex = new RegExp(expectedText)
  await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
}

async function createOrAddV2Pool(page: Page, args: V2PoolArgs) {
  await handleToken(page, args.token0, 'FIRST')
  await handleToken(page, args.token1, 'SECOND')

  const poolTypeSelector = page.locator('[testdata-id=pool-type-classic-pool]')
  await expect(poolTypeSelector).toBeVisible()
  await poolTypeSelector.click()
  await page.locator(`[testdata-id=fee-option-${args.fee}]`).click()

  const feeOptionSelector = page.locator(`[testdata-id=fee-option-${args.fee}]`)
  await expect(feeOptionSelector).toBeVisible()
  await feeOptionSelector.click()

  await page.locator('[testdata-id=add-liquidity-token0-input]').fill(args.amount0)
  await page.locator('[testdata-id=add-liquidity-token1-input]').fill(args.amount1)

  const approveBentoId =
    args.type === 'CREATE' ? 'create-trident-approve-bentobox' : 'add-liquidity-trident-approve-bentobox'
  await approve(page, approveBentoId)
  const approveTokenId =
    args.type === 'CREATE'
      ? `create-trident-approve-token${args.token0.isNative ? 1 : 0}`
      : `add-liquidity-trident-approve-token${args.token0.isNative ? 1 : 0}`
  await approve(page, approveTokenId)

  const reviewSelector =
    args.type === 'CREATE' ? '[testdata-id=create-pool-button]' : '[testdata-id=add-liquidity-button]'
  const reviewButton = page.locator(reviewSelector)
  await expect(reviewButton).toBeVisible()
  await reviewButton.click({ timeout: 2_000 })

  const confirmButton = page.locator('[testdata-id=confirm-add-liquidity-button]')
  await expect(confirmButton).toBeEnabled()
  await confirmButton.click()

  const expectedText = `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`
  const regex = new RegExp(expectedText)
  await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
}

async function removeLiquidityV3(page: Page) {
  const url = process.env.PLAYWRIGHT_URL as string
  await page.goto(url)
  await page.locator('[testdata-id=my-positions-button]').click()

  const firstPositionSelector = page.locator('div:nth-child(2) > div > table > tbody > tr > td > a').first()
  await expect(firstPositionSelector).toBeVisible({ timeout: 7_000 })
  await timeout(5_000) // wait for the animation to finish, otherwise the click will not work. TODO: figure out a better way to do this
  await firstPositionSelector.click()

  const decreaseLiquiditySelector = page.locator('[testdata-id=decrease-liquidity-button]')
  await expect(decreaseLiquiditySelector).toBeVisible({ timeout: 25_000 })
  await decreaseLiquiditySelector.click()

  await switchNetwork(page, CHAIN_ID)

  await page.locator('[testdata-id=liquidity-max-button]').click()
  const handleLiquidityLocator = page.locator('[testdata-id=remove-or-add-liquidity-button]')
  await expect(handleLiquidityLocator).toBeEnabled()
  await handleLiquidityLocator.click()

  const regex = new RegExp('(Successfully removed liquidity from the .* pair)')
  await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
}

async function manageLiquidity(page: Page, type: 'STAKE' | 'UNSTAKE') {
  await switchNetwork(page, CHAIN_ID)
  // check if the max button is visible, otherwise expand the section. For some reason the default state seem to be inconsistent, closed/open.
  const maxButtonSelector = page.locator(`[testdata-id=${type.toLowerCase()}-max-button]`)
  if (!(await maxButtonSelector.isVisible())) {
    await page.locator(`[testdata-id=${type.toLowerCase()}-liquidity-header]`).click()
  }

  await maxButtonSelector.click()
  await approve(page, 'approve-token0')
  await page.locator(`[testdata-id=${type.toLowerCase()}-liquidity-button]`).click({ timeout: 2_000 })

  const regex = new RegExp(`(Successfully ${type.toLowerCase()}d .* SLP tokens)`)
  await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
}

async function removeLiquidityV2(page: Page) {
  await switchNetwork(page, CHAIN_ID)
  await page.locator('[testdata-id=remove-liquidity-max-button]').click()

  await approve(page, 'remove-liquidity-trident-approve-token')
  await page.locator('[testdata-id=remove-liquidity-trident-button]').click({ timeout: 2_000 })

  const regex = new RegExp('(Successfully removed liquidity from the .* pair)')
  await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
}

async function handleToken(page: Page, currency: Type, order: 'FIRST' | 'SECOND') {
  const selectorInfix = `token${order === 'FIRST' ? 0 : 1}`
  const tokenSelector = page.locator(`[testdata-id=${selectorInfix}-select-button]`)
  await expect(tokenSelector).toBeVisible()
  await tokenSelector.click()

  await page.fill(`[testdata-id=${selectorInfix}-token-selector-address-input]`, currency.symbol as string)
  const rowSelector = page.locator(
    `[testdata-id=${selectorInfix}-token-selector-row-${
      currency.isNative ? AddressZero : currency.address.toLowerCase()
    }]`
  )
  await expect(rowSelector).toBeVisible()
  await rowSelector.click()
}

async function switchNetwork(page: Page, chainId: number) {
  await page.getByRole('button', { name: 'Ethereum' }).click()
  await page.locator(`[testdata-id=network-selector-${chainId}]`).click()
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
