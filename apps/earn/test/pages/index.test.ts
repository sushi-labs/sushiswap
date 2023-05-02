import { AddressZero } from '@ethersproject/constants'
import { Page, test, expect } from '@playwright/test'
import { Native } from '@sushiswap/currency'
import { deployFakeToken } from '@sushiswap/wagmi/test/setup'
// import { TRIDENT_ENABLED_NETWORKS } from 'config'
import { Contract } from 'ethers'
// import { deployFakeToken } from '@sushiswap/wagmi'

export interface Token {
  address: string
  symbol: string
}

export async function approveBento(page: Page) {
    await page
      .locator('[testdata-id=create-trident-approve-bentobox]')
      .click({ timeout: 1500 })
      .then(async () => {
        console.log('BentoBox Approved')
      })
      .catch(() => console.log('BentoBox already approved or not needed'))
  }
  
  export async function approveToken(page: Page, locator: string) {
    await page
      .locator(`[testdata-id=${locator}]`)
      .click({ timeout: 1500 })
      .then(async () => {
        console.log('Token Approved')
      })
      .catch(() => console.log('Token already approved or not needed'))
  }


enum PoolType {
  LEGACY,
  CLASSIC,
  STABLE,
}

const PoolFeeTier = {
  LOWEST: '001',
  LOW: '005',
  REGULAR: '03',
  HIGH: '1',
}

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

const CHAIN_ID = parseInt(process.env.CHAIN_ID)
const NATIVE_TOKEN: Token = {
  address: AddressZero,
  symbol: Native.onChain(CHAIN_ID).symbol,
}
const AMOUNT = '10'
let fakeToken: Contract

test.describe('Create/Add', () => {
  test.beforeAll(async () => {
    fakeToken = await deployFakeToken(CHAIN_ID)
  })
  test.beforeEach(async ({ page }) => {
    const url = (process.env.PLAYWRIGHT_URL as string).concat('/add')
    await page.goto(url)
    // await selectNetwork(page, CHAIN_ID)

    // Select pool network
    await page.locator('[testdata-id=earn-add-select-network]').click()
    await page.locator(`[testdata-id=network-selector-${CHAIN_ID}]`).click()
  })

  if (TRIDENT_ENABLED_NETWORKS.indexOf(CHAIN_ID) === -1) {
    test('Create pool legacy', async ({ page }) => {
      await createPool(page, fakeToken, PoolType.LEGACY)
      // todo: assert pool creation
    })

    test('Add liquidity pool legacy', async ({ page }) => {
      await addLiquidityPool(page, fakeToken, PoolType.LEGACY)
      // todo: asset pool add liquidty
    })
  } else {
    test('Create pool trident classic', async ({ page }) => {
      await createPool(page, fakeToken, PoolType.CLASSIC, PoolFeeTier.HIGH)
      // todo: assert pool creation
    })

    test('Add liquidity pool trident classic', async ({ page }) => {
      await addLiquidityPool(page, fakeToken, PoolType.CLASSIC, PoolFeeTier.HIGH)
      // todo: asset pool add liquidty
    })

    test('Create liquidity pool trident stable', async ({ page }) => {
      await createPool(page, fakeToken, PoolType.STABLE, PoolFeeTier.LOWEST)
      // todo: assert pool creation
    })
    test('Add liquidity pool trident stable', async ({ page }) => {
      await addLiquidityPool(page, fakeToken, PoolType.STABLE, PoolFeeTier.LOWEST)
      // todo: assert pool add liquidty
    })
  }
})

async function createPool(page: Page, fakeToken: Contract, poolType: PoolType, fee = '03') {
  await configPool(page, fakeToken, poolType, fee)

  // Input amounts
  await page.locator('[testdata-id=earn-add-input-currency-2-input]').fill(AMOUNT)
  await page.locator('[testdata-id=earn-add-input-currency-1-input]').fill(AMOUNT)

  // Create pool
  if (poolType === PoolType.LEGACY) {
    await page.locator('[testdata-id=earn-add-legacy-button]').click()
  } else {
    await page.locator('[testdata-id=earn-create-trident-button]').click()
    // Approve BentoBox
    await approveBento(page)
  }

  // Approve Token
  await approveToken(
    page,
    poolType === PoolType.LEGACY ? 'add-liquidity-legacy-approve-token1' : 'create-trident-approve-token1'
  )

  const confirmCreatePoolButton = page.locator(
    `[testdata-id=${
      poolType === PoolType.LEGACY ? 'add-legacy-review-confirm-button' : 'create-trident-review-confirm-button'
    }]`
  )
  await expect(confirmCreatePoolButton).toBeVisible({ timeout: 5_000 })
  await confirmCreatePoolButton.click()

  const expectedText = 'Successfully added liquidity to the ETH/FT pair'
  await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)
}

async function addLiquidityPool(page: Page, fakeToken: Contract, poolType: PoolType, fee = '03') {
  await configPool(page, fakeToken, poolType, fee)

  // Input amount for one token
  await page.locator('[testdata-id=earn-add-input-currency-1-input]').fill(AMOUNT)

  // Add liquidity
  if (poolType === PoolType.LEGACY) {
    await page.locator('[testdata-id=earn-add-legacy-button]').click()
  } else {
    await page.locator('[testdata-id=earn-add-trident-button]').click()
    // Approve BentoBox
    await approveBento(page)
  }

  // Approve Token
  await approveToken(
    page,
    poolType === PoolType.LEGACY ? 'add-liquidity-legacy-approve-token1' : 'create-trident-approve-token1'
  )

  const confirmCreatePoolButton = page.locator(
    `[testdata-id=${
      poolType === PoolType.LEGACY ? 'add-legacy-review-confirm-button' : 'add-trident-review-confirm-button'
    }]`
  )
  await expect(confirmCreatePoolButton).toBeVisible({ timeout: 5_000 })
  await confirmCreatePoolButton.click()

  const expectedText = 'Successfully added liquidity to the ETH/FT pair'
  await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)
}

async function configPool(page: Page, fakeToken: Contract, poolType: PoolType, fee = '03') {
  if (poolType !== PoolType.LEGACY) {
    // Select pool type
    await page.locator('[testdata-id=earn-pool-select-type-button]').click()
    await page.locator(`[testdata-id=earn-pool-type-selector-${PoolType[poolType].toLowerCase()}]`).click()

    // Select fee tier
    await page.locator('[testdata-id=earn-pool-select-fee-tier-button]').click()
    await page.locator(`[testdata-id=earn-pool-fee-tier-selector-${fee}]`).click()
  }

  // Select token 1 (Native)
  await page.locator('[testdata-id=earn-add-input-currency-1-button]').click()
  await page
    .locator('[testdata-id=earn-add-input-currency-1-token-selector-dialog-address-input]')
    .fill(NATIVE_TOKEN.symbol)
  await page
    .locator(`[testdata-id=earn-add-input-currency-1-token-selector-dialog-row-${NATIVE_TOKEN.address}]`)
    .click()

  // Select token 2 (Fake token)
  await page.locator('[testdata-id=earn-add-input-currency-2-button]').click()
  await page
    .locator('[testdata-id=earn-add-input-currency-2-token-selector-dialog-address-input]')
    .fill(fakeToken.address)
  timeout(3_000) //can take some time to load the token
  await page.locator(`[testdata-id=import-input-currency-token-selector-dialog-row-${fakeToken.address}]`).click()
  await page.locator(`[testdata-id=import-input-currency-token-confirm-button-${fakeToken.address}]`).click()
  timeout(2_000) //wait for the modal to disappear
}


function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }