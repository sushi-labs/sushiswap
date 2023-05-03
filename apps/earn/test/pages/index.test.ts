import { AddressZero } from '@ethersproject/constants'
import { Page, test, expect } from '@playwright/test'
import { ChainId } from '@sushiswap/chain'
import { DAI_ADDRESS, Native, Token, Type } from '@sushiswap/currency'

export async function approveToken(page: Page, locator: string) {
  await page
    .locator(`[testdata-id=${locator}]`)
    .click({ timeout: 3500 })
    .then(async () => {
      console.log('Token Approved')
    })
    .catch(() => console.log('Token already approved or not needed'))
}

interface AddLiquidityArgs {
  token0: Type
  token1: Type
  startPrice?: string
  minPrice: string
  maxPrice: string
  amount: string
  amountBelongsToToken0: boolean
}

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

const CHAIN_ID = parseInt(process.env.CHAIN_ID)
const NATIVE_TOKEN = Native.onChain(CHAIN_ID)
const DAI = new Token({
  chainId: ChainId.ETHEREUM,
  address: DAI_ADDRESS[ChainId.ETHEREUM],
  decimals: 18,
  symbol: 'DAI',
  name: 'Dai Stablecoin',
})

test.describe('Create/Add', () => {
  test.beforeEach(async ({ page }) => {
    const url = (process.env.PLAYWRIGHT_URL as string).concat('/add').concat(`?chainId=${CHAIN_ID}`)
    await page.goto(url)
  })

  test('Create V3 pool', async ({ page }) => {
    await createOrAddLiquidityToPool(page, {
      token0: NATIVE_TOKEN,
      token1: DAI,
      startPrice: '1800',
      minPrice: '1750',
      maxPrice: '1850',
      amount: '0.1',
      amountBelongsToToken0: false,
    })
  })

  test('Add liquidity to V3, both sides', async ({ page }) => {
    await createOrAddLiquidityToPool(page, {
      token0: NATIVE_TOKEN,
      token1: DAI,
      minPrice: '1700',
      maxPrice: '1900',
      amount: '0.01',
      amountBelongsToToken0: false,
    })
  })

  test('Add liquidity to V3, only one side(ETH)', async ({ page }) => {
    await createOrAddLiquidityToPool(page, {
      token0: NATIVE_TOKEN,
      token1: DAI,
      minPrice: '1900',
      maxPrice: '2000',
      amount: '1',
      amountBelongsToToken0: true,
    })
  })

  test('Add liquidity to V3, only one side(DAI)', async ({ page }) => {
    await createOrAddLiquidityToPool(page, {
      token0: NATIVE_TOKEN,
      token1: DAI,
      minPrice: '1700',
      maxPrice: '1750',
      amount: '0.001',
      amountBelongsToToken0: false,
    })
  })
})



  test('Remove V3 liquidity', async ({ page }) => {
    const url = (process.env.PLAYWRIGHT_URL as string)
    await page.goto(url)
    await removeLiquidity(page)
  })

async function createOrAddLiquidityToPool(page: Page, args: AddLiquidityArgs) {
  await handleToken(page, args.token0, 'FIRST')
  await handleToken(page, args.token1, 'SECOND')
  await timeout(3000) // wait for token to be selected.. Find a better way to do this

  const isPoolCreated = !(await page.locator('[testdata-id=start-price-input]').isVisible())
  if (!isPoolCreated) {
    if (!args.startPrice) {
      throw new Error('startPrice is required')
    }
    await page.locator('[testdata-id=start-price-input]').fill(args.startPrice)
  }
  await page.locator('[testdata-id=min-price-input]').fill(args.minPrice)
  await page.locator('[testdata-id=max-price-input]').fill(args.maxPrice)

  const tokenOrderNumber = args.amountBelongsToToken0 ? 0 : 1
  await page.locator(`[testdata-id=add-liquidity-token${tokenOrderNumber}-input]`).fill(args.amount)

  if ((args.amountBelongsToToken0 && !args.token0.isNative) || (!args.amountBelongsToToken0 && !args.token1.isNative)) {
    await approveToken(page, `approve-erc20-${tokenOrderNumber}`)
  }
  await page.locator('[testdata-id=add-liquidity-preview-button]').click()

  const confirmButton = page.locator('[testdata-id=confirm-add-liquidity-button]')
  expect(confirmButton).toBeVisible()
  await confirmButton.click()

  const expectedText = isPoolCreated
    ? `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`
    : `(Created the ${args.token0.symbol}/${args.token1.symbol} liquidity pool)`
  const regex = new RegExp(expectedText)
  await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
}



async function removeLiquidity(page: Page) {

  await page.locator('[testdata-id=my-positions-button]').click()
  
  await timeout(2000) // wait for positions to load in..
  
  await page.getByRole('link', { name: '1753.95 1851.26 Current: 0.000555509 WETH per DAI' }).click()
  
  await page.locator('[testdata-id=decrease-liquidity-button]').click()
  await page.locator('[testdata-id=liquidity-max-button]').click()
  await page.locator('[testdata-id=remove-or-add-liquidity-button]').click()
  

  const regex = new RegExp('(Successfully removed liquidity from the .* pair)')
  await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
}

async function handleToken(page: Page, currency: Type, order: 'FIRST' | 'SECOND') {
  const selectorInfix = `token${order === 'FIRST' ? 0 : 1}`
  const tokenSelector = page.locator(`[testdata-id=${selectorInfix}-select-button]`)
  expect(tokenSelector).toBeVisible()
  await tokenSelector.click()

  await page.fill(`[testdata-id=${selectorInfix}-token-selector-address-input]`, currency.symbol as string)
  await timeout(500)
  await page
    .locator(
      `[testdata-id=${selectorInfix}-token-selector-row-${
        currency.isNative ? AddressZero : currency.address.toLowerCase()
      }]`
    )
    .click()
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
