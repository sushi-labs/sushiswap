import {
  EvmNative,
  Fee,
  SushiSwapV3FeeAmount,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { chainId, transactionTimeout } from '../constants'
import { expect, test } from '../fixtures'
import { PoolPage } from '../helpers/pool'
import {
  lpBalance,
  mintedPosition,
  positionLiquidity,
  seedV2Pool,
  seedV3Position,
} from './state'

const NATIVE_TOKEN = EvmNative.fromChainId(chainId)

test('returns to the referring pool page after reloading in a fresh tab', async ({
  page,
}) => {
  const previousPage = '/polygon/pool?tab=v2'
  await page.goto(previousPage)
  const newTab = page.waitForEvent('popup', { timeout: 60_000 })
  await page.evaluate(() => {
    window.open('/polygon/pool/v2/add', '_blank')
  })
  const positionPage = await newTab
  await positionPage.reload()

  await positionPage
    .getByRole('button', { name: '← Back', exact: true })
    .click()
  await expect(positionPage).toHaveURL(previousPage)
})

test('switches position types on the same chain and restores the selection on back', async ({
  page,
}) => {
  await page.goto('/polygon/pool/v4/add')
  const selector = page.getByRole('combobox', { name: 'Position type' })
  await expect(selector).toHaveText('V4')

  for (const version of ['V2', 'V3', 'V4']) {
    await selector.click()
    await page.getByRole('option', { name: version, exact: true }).click()
    await expect(page).toHaveURL(`/polygon/pool/${version.toLowerCase()}/add`, {
      timeout: 60_000,
    })
    await expect(selector).toHaveText(version)
  }

  await page.goBack()
  await expect(page).toHaveURL('/polygon/pool/v3/add')
  await expect(selector).toHaveText('V3')
})

// Tests will only work for polygon atm
test.describe('V3', () => {
  test.skip(!isSushiSwapV3ChainId(chainId))
  test('shows position price history for each period in either pair direction', async ({
    page,
    fork,
    mocks,
  }) => {
    const tokenId = await seedV3Position(fork)
    const pool = new PoolPage(page, chainId, fork)
    await pool.mockPoolApi(
      mocks,
      NATIVE_TOKEN.wrap(),
      fork.token,
      SushiSwapV3FeeAmount.HIGH,
      'SUSHISWAP_V3',
    )
    await pool.goToV3Position(fork.token, tokenId)

    const controls = page.getByRole('group', {
      name: 'Price history timeframe',
    })
    const units = `${fork.token.symbol} per ${NATIVE_TOKEN.symbol}`
    const nativeFirst = NATIVE_TOKEN.wrap().sortsBefore(fork.token)
    for (const period of ['1D', '1W', '1M', '1Y', 'All Time']) {
      const button = controls.getByRole('button', { name: period, exact: true })
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      const chart = page.getByRole('img', {
        name: `Pool price history in ${units}, ${period === 'All Time' ? 'all time' : period}`,
        exact: true,
      })
      await expect(chart.locator('canvas')).toBeVisible()
      await expect(chart).toHaveAccessibleDescription(
        new RegExp(nativeFirst ? 'from 1 to 4 ' : 'from 0\\.25 to 1 '),
      )
    }

    await page.getByTitle('Invert price', { exact: true }).click()
    const inverted = page.getByRole('img', {
      name: `Pool price history in ${NATIVE_TOKEN.symbol} per ${fork.token.symbol}, all time`,
      exact: true,
    })
    await expect(inverted.locator('canvas')).toBeVisible()
    await expect(inverted).toHaveAccessibleDescription(
      new RegExp(nativeFirst ? 'from 0\\.25 to 1 ' : 'from 1 to 4 '),
    )
  })

  test('Create pool, add a single-sided position and remove the original position', async ({
    page,
    fork,
    mocks,
  }) => {
    test.setTimeout(240_000)
    const FAKE_TOKEN = fork.token
    const url = `/${chainId}/pool/v3/add`
    const poolPage = new PoolPage(page, chainId, fork)

    await poolPage.mockPoolApi(
      mocks,
      poolPage.nativeToken.wrap(),
      FAKE_TOKEN,
      SushiSwapV3FeeAmount.HIGH,
      'SUSHISWAP_V3',
    )

    await poolPage.goTo(url)
    await poolPage.connect()

    const created = await poolPage.createV3Pool({
      token0: NATIVE_TOKEN,
      token1: FAKE_TOKEN,
      startPrice: '0.5',
      minPrice: '0.1',
      maxPrice: '0.9',
      amount: '0.0001',
      amountBelongsToToken0: false,
    })

    const positionId = mintedPosition(created)
    expect(await positionLiquidity(fork, positionId)).toBeGreaterThan(0n)
    await page.reload()
    await poolPage.connect()
    const added = await poolPage.addLiquidityV3({
      token0: NATIVE_TOKEN,
      token1: FAKE_TOKEN,
      minPrice: '0.2',
      maxPrice: '0.4',
      amount: '0.0001',
      amountBelongsToToken0: false,
    })

    expect(
      await positionLiquidity(fork, mintedPosition(added)),
    ).toBeGreaterThan(0n)
    await poolPage.removeLiquidityV3(FAKE_TOKEN, positionId)
    expect(await positionLiquidity(fork, positionId)).toBe(0n)
  })
})

test.describe('V2', () => {
  test.skip(!isSushiSwapV2ChainId(chainId))

  test('Create, add & remove', async ({ page, fork, mocks }) => {
    test.setTimeout(240_000)
    const FAKE_TOKEN = fork.token
    const poolPage = new PoolPage(page, chainId, fork)

    const url = `/${chainId}/pool/v2/add`

    await poolPage.mockPoolApi(
      mocks,
      poolPage.nativeToken.wrap(),
      FAKE_TOKEN,
      Fee.DEFAULT,
      'SUSHISWAP_V2',
    )

    await poolPage.goTo(url)
    await poolPage.connect()

    await poolPage.createV2Pool({
      token0: NATIVE_TOKEN,
      token1: FAKE_TOKEN,
      amount0: '1',
      amount1: '1',
    })

    const originalLp = await lpBalance(fork)
    expect(originalLp).toBeGreaterThan(0n)
    await poolPage.addLiquidityV2({
      token0: NATIVE_TOKEN,
      token1: FAKE_TOKEN,
      amount0: '10',
      amount1: '10',
    })

    expect(await lpBalance(fork)).toBeGreaterThan(originalLp)
    await poolPage.removeLiquidityV2(FAKE_TOKEN)
    expect(await lpBalance(fork)).toBe(0n)
  })
})

for (const version of ['V2', 'V3'] as const) {
  test(`${version} removes a preseeded position independently`, async ({
    page,
    fork,
    mocks,
  }) => {
    const tokenId = version === 'V3' ? await seedV3Position(fork) : undefined
    if (version === 'V2') await seedV2Pool(fork)
    const pool = new PoolPage(page, chainId, fork)
    await pool.mockPoolApi(
      mocks,
      NATIVE_TOKEN.wrap(),
      fork.token,
      version === 'V3' ? SushiSwapV3FeeAmount.HIGH : Fee.DEFAULT,
      version === 'V3' ? 'SUSHISWAP_V3' : 'SUSHISWAP_V2',
    )
    if (tokenId !== undefined) {
      await pool.removeLiquidityV3(fork.token, tokenId)
      expect(await positionLiquidity(fork, tokenId)).toBe(0n)
      await expect(
        page
          .getByRole('status')
          .filter({ hasText: 'This position is closed.' }),
      ).toBeVisible({ timeout: transactionTimeout })
      await expect(
        page.getByRole('group', { name: 'Price history timeframe' }),
      ).toHaveCount(0)
    } else {
      await pool.removeLiquidityV2(fork.token)
      expect(await lpBalance(fork)).toBe(0n)
    }
  })
}

for (const version of ['V2', 'V3'] as const) {
  test(`${version} adds to a preseeded pool independently`, async ({
    page,
    fork,
    mocks,
  }) => {
    if (version === 'V3') await seedV3Position(fork)
    else await seedV2Pool(fork)
    const pool = new PoolPage(page, chainId, fork)
    await pool.mockPoolApi(
      mocks,
      NATIVE_TOKEN.wrap(),
      fork.token,
      version === 'V3' ? SushiSwapV3FeeAmount.HIGH : Fee.DEFAULT,
      version === 'V3' ? 'SUSHISWAP_V3' : 'SUSHISWAP_V2',
    )
    await page.goto(`/polygon/pool/${version.toLowerCase()}/add`)
    await pool.connect()
    if (version === 'V3') {
      const receipt = await pool.addLiquidityV3({
        token0: NATIVE_TOKEN,
        token1: fork.token,
        minPrice: '0.5',
        maxPrice: '2',
        amount: '0.0001',
        amountBelongsToToken0: false,
      })
      expect(
        await positionLiquidity(fork, mintedPosition(receipt)),
      ).toBeGreaterThan(0n)
    } else {
      const before = await lpBalance(fork)
      await pool.addLiquidityV2({
        token0: NATIVE_TOKEN,
        token1: fork.token,
        amount0: '0.1',
        amount1: '0.1',
      })
      expect(await lpBalance(fork)).toBeGreaterThan(before)
    }
  })
}
