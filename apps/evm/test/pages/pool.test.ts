import { expect, Page, test } from '@playwright/test'
import { Native, SUSHI, Token, Type, FAKE_TOKEN_ADDRESS } from '@sushiswap/currency'
import { zeroAddress } from 'viem'
import { createERC20, getFee } from '../createERC20'
import { computePoolAddress, SUSHISWAP_V3_FACTORY_ADDRESS } from '@sushiswap/v3-sdk'

interface TridentPoolArgs {
  token0: Type
  token1: Type
  amount0: string
  amount1: string
  fee: string
  type: 'CREATE' | 'ADD'
}

interface V2PoolArgs {
  token0: Type
  token1: Type
  amount0: string
  amount1: string
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

interface IncenvitivePoolArgs {
  token0: Type
  token1: Type
}

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

const CHAIN_ID = parseInt(process.env.CHAIN_ID)
const NATIVE_TOKEN = Native.onChain(CHAIN_ID)
// const FAKE_TOKEN = new Token({
//   chainId: CHAIN_ID,
//   address: FAKE_TOKEN_ADDRESS[CHAIN_ID as keyof typeof FAKE_TOKEN_ADDRESS],
//   decimals: 18,
//   symbol: 'FAKE_TOKEN',
//   name: 'FAKE_TOKEN Stablecoin',
// })

let FAKE_TOKEN: Token
const BASE_URL = 'http://localhost:3000/pool'

// Tests will only work for polygon atm
test.describe('V3', () => {
  test('Create pool', async ({ page }) => {
    test.slow()
    const fakeTokenAddress = await createERC20(CHAIN_ID)
    FAKE_TOKEN = new Token({
      chainId: CHAIN_ID,
      address: fakeTokenAddress,
      decimals: 18,
      symbol: 'FT',
      name: 'FakeToken',
    })
    await mockTokenApi(page, fakeTokenAddress)

    const url = BASE_URL.concat('/add').concat(`?chainId=${CHAIN_ID}`)
    await page.goto(url)
    await switchNetwork(page, CHAIN_ID)
    await createOrAddLiquidityV3(page, {
      token0: NATIVE_TOKEN,
      token1: FAKE_TOKEN,
      startPrice: '0.5',
      minPrice: '0.1',
      maxPrice: '0.9',
      amount: '0.001',
      amountBelongsToToken0: false,
      type: 'CREATE',
    })
  })

  // // // TODO: most of the tests below are dependent to the Create Pool test. Consider if we should put the creation in a beforeAll.
  // test('Add liquidity, both sides', async ({ page }) => {
  //   test.slow()
  //   await createOrAddLiquidityV3(page, {
  //     token0: NATIVE_TOKEN,
  //     token1: FAKE_TOKEN,
  //     minPrice: '0.3',
  //     maxPrice: '0.7',
  //     amount: '0.0001',
  //     amountBelongsToToken0: false,
  //     type: 'ADD',
  //   })
  // })

  // test('Add liquidity, only one side(NATIVE)', async ({ page }) => {
  //   test.slow()
  //   await createOrAddLiquidityV3(page, {
  //     token0: NATIVE_TOKEN,
  //     token1: FAKE_TOKEN,
  //     minPrice: '0.8',
  //     maxPrice: '0.9',
  //     amount: '1',
  //     amountBelongsToToken0: true,
  //     type: 'ADD',
  //   })
  // })

  // test('Add liquidity, only one side(FAKE_TOKEN)', async ({ page }) => {
  //   test.slow()
  //   await createOrAddLiquidityV3(page, {
  //     token0: NATIVE_TOKEN,
  //     token1: FAKE_TOKEN,
  //     minPrice: '0.2',
  //     maxPrice: '0.4',
  //     amount: '0.0001',
  //     amountBelongsToToken0: false,
  //     type: 'ADD',
  //   })
  // })

  test('Remove liquidity', async ({ page }) => {
    test.slow()
    await removeLiquidityV3(page)
  })
})

// test.describe('Trident', () => {
//   test.beforeEach(async ({ page }) => {
//     const url = BASE_URL.concat(`/add/trident/${CHAIN_ID}`)
//     await page.goto(url)
//     await switchNetwork(page, CHAIN_ID)
//   })

//   test('Create pool', async ({ page }) => {
//     test.slow()
//     await createOrAddTridentPool(page, {
//       // 0.01% fee is not created at block 42259027
//       token0: NATIVE_TOKEN,
//       token1: FAKE_TOKEN,
//       amount0: '0.0001',
//       amount1: '0.0001',
//       fee: '1',
//       type: 'CREATE',
//     })
//   })

//   test('Add, stake, unstake and remove', async ({ page }) => {
//     test.slow()
//     await createOrAddTridentPool(page, {
//       token0: NATIVE_TOKEN,
//       token1: FAKE_TOKEN,
//       amount0: '0.0001',
//       amount1: '0.0001',
//       fee: '5',
//       type: 'ADD',
//     })

//     const addLiquidityUrl = BASE_URL.concat('/137:0x846fea3d94976ef9862040d9fba9c391aa75a44b')
//     await page.goto(addLiquidityUrl, { timeout: 25_000 })
//     await manageStaking(page, 'STAKE')

//     const removeLiquidityUrl = BASE_URL.concat('/137:0x846fea3d94976ef9862040d9fba9c391aa75a44b')
//     await page.goto(removeLiquidityUrl, { timeout: 25_000 })
//     await manageStaking(page, 'UNSTAKE')
//     await page.reload({ timeout: 25_000 })
//     await removeLiquidityV2(page)
//   })
// })

// test.describe('V2', () => {
//   test.beforeEach(async ({ page }) => {
//     const url = BASE_URL.concat(`/add/v2/${CHAIN_ID}`)
//     await page.goto(url)
//     await switchNetwork(page, CHAIN_ID)
//   })

//   test('Add liquidity', async ({ page }) => {
//     test.slow()
//     await createOrAddV2Pool(page, {
//       token0: NATIVE_TOKEN,
//       token1: FAKE_TOKEN,
//       amount0: '0.0001',
//       amount1: '0.0001',
//       type: 'ADD',
//     })
//   })
// })

async function createOrAddLiquidityV3(page: Page, args: V3PoolArgs) {
  await handleToken(page, args.token0, 'FIRST')
  await handleToken(page, args.token1, 'SECOND')
  const feeOptionSelector = page.locator('[testdata-id=fee-option-10000]')
  await expect(feeOptionSelector).toBeEnabled()
  await feeOptionSelector.click()
  await expect(feeOptionSelector).toHaveAttribute('data-state', 'on')

  if (args.type === 'CREATE' && args.startPrice) {
    await page.locator('[testdata-id=start-price-input]').fill(args.startPrice)
  }
  await page.locator('[testdata-id=min-price-input]').fill(args.minPrice)
  await page.locator('[testdata-id=max-price-input]').fill(args.maxPrice)

  const tokenOrderNumber = args.amountBelongsToToken0 ? 0 : 1
  await page.locator(`[testdata-id=add-liquidity-token${tokenOrderNumber}-input]`).fill(args.amount)

  if ((args.amountBelongsToToken0 && !args.token0.isNative) || (!args.amountBelongsToToken0 && !args.token1.isNative)) {
    const approveTokenLocator = page.locator(`[testdata-id=${`approve-erc20-${tokenOrderNumber}-button`}]`)
    await expect(approveTokenLocator).toBeVisible()
    await expect(approveTokenLocator).toBeEnabled()
    await approveTokenLocator.click()
  }
  const previewLocator = page.locator('[testdata-id=add-liquidity-preview-button]')
  await expect(previewLocator).toBeVisible({ timeout: 10_000 })
  await expect(previewLocator).toBeEnabled()
  await previewLocator.click()
  await page.locator('[testdata-id=confirm-add-liquidity-button]').click({ timeout: 5_000 })

  const expectedText =
    args.type === 'ADD'
      ? `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`
      : `(Created the ${args.token0.symbol}/${args.token1.symbol} liquidity pool)`
  const regex = new RegExp(expectedText)
  expect(page.getByText(regex))
}

async function createOrAddTridentPool(page: Page, args: TridentPoolArgs) {
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

  if (args.type === 'CREATE') {
    const approveBentoLocator = page.locator(`[testdata-id=create-trident-approve-bentobox-button]`)
    await expect(approveBentoLocator).toBeVisible()
    await expect(approveBentoLocator).toBeEnabled()
    await approveBentoLocator.click()
  }
  const approveTokenId =
    args.type === 'CREATE'
      ? `create-trident-approve-token${args.token0.isNative ? 1 : 0}-button`
      : `add-liquidity-trident-approve-token${args.token0.isNative ? 1 : 0}-button`

  const approveTokenLocator = page.locator(`[testdata-id=${approveTokenId}]`)
  await expect(approveTokenLocator).toBeVisible()
  await expect(approveTokenLocator).toBeEnabled()
  await approveTokenLocator.click()

  const reviewSelector =
    args.type === 'CREATE' ? '[testdata-id=create-pool-button]' : '[testdata-id=add-liquidity-button]'
  const reviewButton = page.locator(reviewSelector)
  await expect(reviewButton).toBeVisible()
  await expect(reviewButton).toBeEnabled()
  await reviewButton.click()

  const confirmButton = page.locator('[testdata-id=confirm-add-liquidity-button]')
  await expect(confirmButton).toBeVisible()
  await expect(confirmButton).toBeEnabled()
  await confirmButton.click()

  const expectedText = `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`
  const regex = new RegExp(expectedText)
  expect(page.getByText(regex))
}

async function createOrAddV2Pool(page: Page, args: V2PoolArgs) {
  await handleToken(page, args.token0, 'FIRST')
  await handleToken(page, args.token1, 'SECOND')
  if (args.type === 'CREATE') {
    // NOT Sure about this logic as we need a token and currency combination that isn't created to test this.
    await page.locator('[testdata-id=add-liquidity-token0-input]').fill(args.amount0)
    await page.locator('[testdata-id=add-liquidity-token1-input]').fill(args.amount1)
  } else {
    // Only fill in the token that is not native if we are adding liquidity to an existing pool.
    await page
      .locator(`[testdata-id=add-liquidity-token${args.token0.isNative ? 1 : 0}-input]`)
      .fill(args.token0.isNative ? args.amount1 : args.amount0)
  }

  if (args.type === 'ADD') {
    const approveTokenId = `approve-token-${args.token0.isNative ? 1 : 0}-button`
    const approveTokenLocator = page.locator(`[testdata-id=${approveTokenId}]`)
    await expect(approveTokenLocator).toBeVisible()
    await expect(approveTokenLocator).toBeEnabled()
    await approveTokenLocator.click()
  }
  const reviewSelector =
    args.type === 'CREATE' ? '[testdata-id=create-pool-button]' : '[testdata-id=add-liquidity-button]'
  const reviewButton = page.locator(reviewSelector)
  await expect(reviewButton).toBeVisible()
  await expect(reviewButton).toBeEnabled()
  await reviewButton.click({ timeout: 2_000 })

  const confirmButton = page.locator('[testdata-id=confirm-add-v2-liquidity-button]')
  await expect(confirmButton).toBeVisible()
  await expect(confirmButton).toBeEnabled()
  await confirmButton.click()

  const expectedText = `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`
  const regex = new RegExp(expectedText)
  expect(page.getByText(regex))
}

async function removeLiquidityV3(page: Page) {
  await mockPoolApi(page, NATIVE_TOKEN.wrapped, FAKE_TOKEN, 10000, 'SUSHISWAP_V3')
  await mockPoolApi(page, NATIVE_TOKEN.wrapped, FAKE_TOKEN, 10000, 'SUSHISWAP_V3')
  await page.goto(BASE_URL)
  await page.locator('[testdata-id=my-positions-button]').click()

  const concentratedPositionTableSelector = page.locator('[testdata-id=concentrated-positions-loading-0]')
  await expect(concentratedPositionTableSelector).not.toBeVisible()

  const firstPositionSelector = page.locator('[testdata-id=concentrated-positions-0-0-td]')
  await expect(firstPositionSelector).toBeVisible()
  await firstPositionSelector.click()

  const removeLiquidityTabSelector = page.locator('[testdata-id=remove-tab]')
  await expect(removeLiquidityTabSelector).toBeVisible()
  await removeLiquidityTabSelector.click()

  await switchNetwork(page, CHAIN_ID)

  await page.locator('[testdata-id=liquidity-max-button]').click()
  const handleLiquidityLocator = page.locator('[testdata-id=remove-or-add-liquidity-button]')
  await expect(handleLiquidityLocator).toBeVisible()
  await expect(handleLiquidityLocator).toBeEnabled() // needed, not sure why, my guess is that a web3 call hasn't finished and button shouldn't be enabled yet.
  await handleLiquidityLocator.click()

  const regex = new RegExp('(Successfully removed liquidity from the .* pair)')
  expect(page.getByText(regex))
}

async function manageStaking(page: Page, type: 'STAKE' | 'UNSTAKE') {
  await switchNetwork(page, CHAIN_ID)

  const removeLiquidityTabSelector = page.locator(`[testdata-id=${type.toLowerCase()}-tab]`)
  await expect(removeLiquidityTabSelector).toBeVisible()
  await removeLiquidityTabSelector.click()

  const maxButtonSelector = page.locator(`[testdata-id=${type.toLowerCase()}-max-button]`)

  await expect(maxButtonSelector).toBeVisible()
  await expect(maxButtonSelector).toBeEnabled()
  await maxButtonSelector.click()
  if (type === 'STAKE') {
    const approveSlpId = `${type.toLowerCase()}-approve-slp-button`
    const approveSlpLocator = page.locator(`[testdata-id=${approveSlpId}]`)
    await expect(approveSlpLocator).toBeVisible()
    await expect(approveSlpLocator).toBeEnabled()
    await approveSlpLocator.click()
  }

  const actionSelector = page.locator(`[testdata-id=${type.toLowerCase()}-liquidity-button]`)
  await expect(actionSelector).toBeVisible()
  await expect(actionSelector).toBeEnabled()
  await actionSelector.click({ timeout: 2_000 })

  const regex = new RegExp(`(Successfully ${type.toLowerCase()}d .* SLP tokens)`)
  expect(page.getByText(regex))
}

async function removeLiquidityV2(page: Page) {
  await switchNetwork(page, CHAIN_ID)

  const removeLiquidityTabSelector = page.locator(`[testdata-id=remove-tab]`)
  await expect(removeLiquidityTabSelector).toBeVisible()
  await removeLiquidityTabSelector.click()

  await page.locator('[testdata-id=remove-liquidity-max-button]').click()

  const approveSlpId = 'approve-remove-liquidity-slp-button'
  const approveSlpLocator = page.locator(`[testdata-id=${approveSlpId}]`)
  await expect(approveSlpLocator).toBeVisible()
  await expect(approveSlpLocator).toBeEnabled()
  await approveSlpLocator.click()

  const removeLiquidityLocator = page.locator('[testdata-id=remove-liquidity-button]')

  await expect(removeLiquidityLocator).toBeVisible()
  await expect(removeLiquidityLocator).toBeEnabled()
  await removeLiquidityLocator.click()

  const regex = new RegExp('(Successfully removed liquidity from the .* pair)')
  expect(page.getByText(regex))
}

// test.describe('Incentivize', () => {
//   test.beforeEach(async ({ page }) => {
//     const url = BASE_URL.concat(`/incentivize`).concat(`?chainId=${CHAIN_ID}`)
//     await page.goto(url)
//     await switchNetwork(page, CHAIN_ID)
//   })

//   test('Incentivize pool', async ({ page }) => {
//     test.slow()
//     await incentivizePool(page, { token0: NATIVE_TOKEN.wrapped, token1: FAKE_TOKEN })
//   })
// })

async function incentivizePool(page: Page, args: IncenvitivePoolArgs) {
  await handleToken(page, args.token0, 'FIRST')
  await handleToken(page, args.token1, 'SECOND')
  const feeOptionSelector = page.locator('[testdata-id=fee-option-500]')
  await expect(feeOptionSelector).toBeEnabled()
  await feeOptionSelector.click()
  await expect(feeOptionSelector).toBeChecked()

  await selectDate('[testdata-id=start-date]', 1, '001', page)
  await selectDate('[testdata-id=end-date]', 0, '002', page)

  const input0 = page.locator('[testdata-id=swap-from-input]')
  await expect(input0).toBeVisible()
  await expect(input0).toBeEnabled()
  await input0.fill('2.4')

  const button0 = page.locator('[testdata-id=swap-from-button-button]')
  await expect(button0).toBeVisible()
  await expect(button0).toBeEnabled()
  await button0.click()

  await page.fill('[testdata-id=swap-from-token-selector-address-input]', 'SUSHI')
  const rowSelector = page.locator(
    `[testdata-id=swap-from-token-selector-row-${SUSHI[CHAIN_ID].address.toLowerCase()}]`
  )
  await expect(rowSelector).toBeVisible()
  await rowSelector.click()

  const approveTokenId = 'approve-erc20-button'
  const approveTokenLocator = page.locator(`[testdata-id=${approveTokenId}]`)
  await expect(approveTokenLocator).toBeVisible()
  await expect(approveTokenLocator).toBeEnabled()
  await approveTokenLocator.click()

  const previewLocator = page.locator('[testdata-id=incentivize-pool-review]')
  await expect(previewLocator).toBeVisible({ timeout: 10_000 })
  await expect(previewLocator).toBeEnabled()
  await previewLocator.click()
  await page.locator('[testdata-id=incentivize-pool-confirm]').click({ timeout: 5_000 })
}

async function handleToken(page: Page, currency: Type, order: 'FIRST' | 'SECOND') {
  const selectorInfix = `token${order === 'FIRST' ? 0 : 1}`
  const tokenSelector = page.locator(`[testdata-id=${selectorInfix}-select-button]`)
  await expect(tokenSelector).toBeVisible()
  await tokenSelector.click()
  await page.fill(`[testdata-id=${selectorInfix}-token-selector-address-input]`, currency.symbol as string)
  const rowSelector = page.locator(
    `[testdata-id=${selectorInfix}-token-selector-row-${
      currency.isNative ? zeroAddress : currency.wrapped.address.toLowerCase()
    }]`
  )
  await expect(rowSelector).toBeVisible()
  await rowSelector.click()
}

async function switchNetwork(page: Page, chainId: number) {
  const networkSelector = page.locator('[testdata-id=network-selector-button]')
  await expect(networkSelector).toBeVisible()
  await expect(networkSelector).toBeEnabled()
  await networkSelector.click()

  const networkToSelect = page.locator(`[testdata-id=network-selector-${chainId}]`)
  await expect(networkToSelect).toBeVisible()
  await expect(networkToSelect).toBeEnabled()
  await networkToSelect.click()
}

export async function selectDate(selector: string, months: number, day: string, page: Page) {
  await page.locator(selector).click()
  for (let i = 0; i < months; i++) {
    await page.locator(`[aria-label="Next Month"]`).click()
  }

  await page
    .locator(
      `div.react-datepicker__day.react-datepicker__day--${day}, div.react-datepicker__day.react-datepicker__day--${day}.react-datepicker__day--weekend`
    )
    .last()
    .click()

  await page.locator('li.react-datepicker__time-list-item').first().click()
}

async function mockTokenApi(page: Page, tokenAddress: string) {
  await page.route('https://gateway.ipfs.io/ipns/tokens.uniswap.org', async (route, request) => {
    const response = await route.fetch()
    const json = await response.json()
    json.tokens.push({
      chainId: CHAIN_ID,
      address: tokenAddress.toLowerCase(),
      name: 'FakeToken',
      symbol: 'FT',
      decimals: 18,
    })
    await route.fulfill({ response, json })
  })
}

async function mockPoolApi(
  page: Page,
  token0: Token,
  token1: Token,
  fee: number,
  protocol: 'SUSHISWAP_V2' | 'SUSHISWAP_V3'
) {
  await page.route('https://pools.sushi.com/api/v0/**', async (route, request) => {
    const response = await route.fetch()
    const json = await response.json()
    if (Array.isArray(json)) {
      const [tokenA, tokenB] = token0.sortsBefore(token1) ? [token0, token1] : [token1, token0] // does safety checks
      const address = computePoolAddress({
        factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[CHAIN_ID],
        tokenA,
        tokenB,
        fee: fee,
      }).toLowerCase()
      json.push({
        id: `${CHAIN_ID}:${address}`.toLowerCase(),
        address,
        name: `${token0.symbol}-${token1.symbol}`,
        chainId: 1,
        protocol,
        swapFee: fee / (protocol === 'SUSHISWAP_V3' ? 1000000 : 10000),
        twapEnabled: false,
        totalSupply: '83920283456658325128353',
        liquidityUSD: '49077510.40587655',
        volumeUSD: '2290939341.058367',
        feeApr1h: 0.0006274923228659006,
        feeApr1d: 0.01099850428577075,
        feeApr1w: 0.006921134785944006,
        feeApr1m: 0.02211823402986143,
        totalApr1h: 0.2610697581204364,
        totalApr1d: 0.2714407700833413,
        totalApr1w: 0.2825604998274319,
        totalApr1m: 0.2825604998274319,
        incentiveApr: 0,
        isIncentivized: false,
        wasIncentivized: true,
        fees1h: '3.515497831627727',
        fees1d: '1478.847146668471',
        fees1w: '6532.155086108483',
        fees1m: '90458.98839667812',
        feesChange1h: -0.7764003430377564,
        feesChange1d: -0.2540476386289081,
        feesChange1w: -0.5310849974207801,
        feesChange1m: 1.030447648981485,
        volume1h: '1171.832610607147',
        volume1d: '492949.048889637',
        volume1w: '2177385.028703213',
        volume1m: '30152996.13222599',
        volumeChange1h: -0.7764003430164287,
        volumeChange1d: -0.2540476386288545,
        volumeChange1w: -0.5310849974206884,
        volumeChange1m: 1.030447648981475,
        liquidityUSDChange1h: -0.001183849659862291,
        liquidityUSDChange1d: -0.009909408407222764,
        liquidityUSDChange1w: 0.02286513758143083,
        liquidityUSDChange1m: -0.03222759286580335,
        isBlacklisted: false,
        token0: tokenA,
        token1: tokenB,
        incentives: [],
        hadEnabledSteerVault: false,
        hasEnabledSteerVault: false,
        steerVaults: [],
      })
    } else {
      const count = json.count + 1
      return await route.fulfill({ json: count })
    }
    return await route.fulfill({ json })
  })
}

// async function mockPoolCountApi(page: Page) {
//   await page.route('https://pools.sushi.com/api/v0/count**', async (route, request) => {
//     const json = {count: 1}
//   await route.fulfill({ json });
//   })
// }
