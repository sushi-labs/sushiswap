import {
  EvmNative,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SushiSwapV3FeeAmount,
  computeSushiSwapV3PoolAddress,
} from 'sushi/evm'
import { chainId } from '../constants'
import { expect, test } from '../fixtures'
import { PoolPage } from '../helpers/pool'
import { mintedPosition, positionLiquidity } from './state'

for (const { usdAvailable, singleToken } of [true, false].flatMap(
  (usdAvailable) =>
    [false, true].map((singleToken) => ({ usdAvailable, singleToken })),
)) {
  test(`Simple range creates a V3 pool and adds a new position (USD available: ${usdAvailable}, single token: ${singleToken})`, async ({
    page,
    fork,
    mocks,
  }) => {
    test.setTimeout(240_000)
    const native = EvmNative.fromChainId(chainId)
    const fee = SushiSwapV3FeeAmount.HIGH
    const pool = new PoolPage(page, chainId, fork)
    const poolAddress = computeSushiSwapV3PoolAddress({
      factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
      tokenA: fork.token,
      tokenB: native.wrap(),
      fee,
    })
    await pool.mockPoolApi(
      mocks,
      fork.token,
      native.wrap(),
      fee,
      'SUSHISWAP_V3',
    )
    // The price worker consumes 20-byte addresses followed by float32 USD
    // prices. Only the paired token is priced; the new token has no quote.
    const prices = Buffer.alloc(usdAvailable ? 24 : 0)
    if (usdAvailable) {
      Buffer.from(native.wrap().address.slice(2), 'hex').copy(prices)
      prices.writeFloatLE(2, 20)
    }
    await page.route(`**/price/v1/${chainId}?*`, (route) =>
      route.fulfill({
        contentType: 'application/octet-stream',
        body: prices,
      }),
    )
    await page.goto(
      `/polygon/pool/v3/add?fromCurrency=${fork.token.address}&toCurrency=NATIVE&feeAmount=${fee}`,
    )
    await expect(
      page.getByRole('radio', { name: 'Advanced', exact: true }),
    ).not.toBeChecked()
    const usd = page.getByRole('radio', { name: 'USD', exact: true })
    if (usdAvailable) {
      await expect(usd).toBeEnabled()
      await expect(usd).toBeChecked()
    } else {
      await expect(usd).toBeDisabled()
      await expect(page.getByText(/USD value unavailable:/)).toBeVisible()
    }
    await page.locator('#simple-start-price').fill(usdAvailable ? '1' : '0.5')
    await page.locator('#simple-min-price').fill(usdAvailable ? '0.2' : '0.1')
    await page.locator('#simple-max-price').fill(usdAvailable ? '1.8' : '0.9')
    await page.locator('#simple-max-price').blur()

    if (singleToken) {
      // Presets must work before connecting, without consulting wallet balances.
      const presets = page.getByRole('radiogroup', { name: 'Deposit tokens' })
      await expect(
        presets.getByRole('radio', { name: `${fork.token.symbol} only` }),
      ).toBeEnabled()
      await expect(
        presets.getByRole('radio', { name: `${native.symbol} only` }),
      ).toBeEnabled()
      await presets
        .getByRole('radio', { name: `${fork.token.symbol} only` })
        .click()
      await expect(
        page.locator('[testdata-id=add-liquidity-token0-input]'),
      ).toBeEnabled()
      await expect(
        page.locator('[testdata-id=add-liquidity-token1-input]'),
      ).toBeDisabled()
      for (const exit of ['Both tokens', `${fork.token.symbol} only`]) {
        await presets.getByRole('radio', { name: exit, exact: true }).click()
        await expect(
          page.locator('[testdata-id=add-liquidity-token0-input]'),
        ).toBeEnabled()
        await expect(
          page.locator('[testdata-id=add-liquidity-token1-input]'),
        ).toBeEnabled()
        await presets
          .getByRole('radio', { name: `${fork.token.symbol} only` })
          .click()
      }
    }

    // Switching modes must preserve the starting price and chosen pair range.
    await page.getByRole('radio', { name: 'Advanced', exact: true }).check()
    await expect(page.locator('[testdata-id=start-price-input]')).toHaveValue(
      '0.5',
    )
    const min = await page.locator('#min-price').inputValue()
    const max = await page.locator('#max-price').inputValue()
    await page.getByRole('radio', { name: 'Simple', exact: true }).check()
    await page.getByRole('radio', { name: 'Advanced', exact: true }).check()
    await expect(page.locator('#min-price')).toHaveValue(min)
    await expect(page.locator('#max-price')).toHaveValue(max)
    await page.getByRole('radio', { name: 'Simple', exact: true }).check()

    async function deposit(tokenIndex: number): Promise<void> {
      await page
        .locator(`[testdata-id=add-liquidity-token${tokenIndex}-input]`)
        .fill('0.0001')
      const switchNetwork = page
        .locator(`[testdata-id=switch-network-${chainId}-button]`)
        .first()
      if (await switchNetwork.isVisible()) await pool.switchNetwork(chainId)
      const preview = page.locator('[testdata-id=add-liquidity-preview-button]')
      await pool.approveIfNeeded(
        page.locator(`[testdata-id=approve-erc20-${tokenIndex}-button]`),
        preview,
      )
      await expect(preview).toBeEnabled()
      await preview.click()
      const receipt = await pool.transact('Add Simple V3 liquidity', () =>
        page.locator('[testdata-id=confirm-add-liquidity-button]').click(),
      )
      expect(
        await positionLiquidity(fork, mintedPosition(receipt)),
      ).toBeGreaterThan(0n)
    }
    await pool.connect()
    await deposit(0)

    await page.goto(`/polygon/pool/v3/${poolAddress}/create`)
    await pool.connect()
    await expect(
      page.getByRole('radio', { name: 'Advanced', exact: true }),
    ).not.toBeChecked()
    // NewPosition uses the pool's sorted tokens. Select the new token's price
    // without changing the deposit token order.
    await page
      .getByRole('radiogroup', { name: 'Price token' })
      .getByRole('radio', { name: fork.token.symbol, exact: true })
      .click()
    await expect(page.locator('#simple-start-price')).toHaveCount(0)
    await page.locator('#simple-min-price').fill(usdAvailable ? '0.5' : '0.25')
    await page.locator('#simple-max-price').fill(usdAvailable ? '1.5' : '0.75')
    await page.locator('#simple-max-price').blur()

    if (singleToken) {
      await page
        .getByRole('radiogroup', { name: 'Deposit tokens' })
        .getByRole('radio', { name: `${native.symbol} only` })
        .click()
    }

    // The existing-pool view mounts the real chart in Advanced mode.
    await page.getByRole('radio', { name: 'Advanced', exact: true }).check()
    const existingMin = await page.locator('#min-price').inputValue()
    const existingMax = await page.locator('#max-price').inputValue()
    await page.getByRole('radio', { name: 'Simple', exact: true }).check()
    await page.getByRole('radio', { name: 'Advanced', exact: true }).check()
    await expect(page.locator('#min-price')).toHaveValue(existingMin)
    await expect(page.locator('#max-price')).toHaveValue(existingMax)
    await page.getByRole('radio', { name: 'Simple', exact: true }).check()
    await page
      .getByRole('radiogroup', { name: 'Price token' })
      .getByRole('radio', { name: fork.token.symbol, exact: true })
      .click()

    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect(page.locator('#simple-min-price')).toBeVisible()
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true)
      if (width === 390) {
        await test.info().attach('simple-range-mobile', {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        })
      }
    }
    await page.setViewportSize({ width: 1280, height: 1000 })
    await test.info().attach('simple-range', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    })
    // The graph fixture returns tokens in canonical pool order, which may put
    // the new token in either deposit field.
    const newTokenIndex = fork.token.sortsBefore(native.wrap()) ? 0 : 1
    const tokenIndex = singleToken ? 1 - newTokenIndex : newTokenIndex
    await deposit(tokenIndex)
  })
}
