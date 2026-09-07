import { type Page, expect, test } from '@playwright/test'
import { NativeAddress } from 'src/lib/constants'
import type { Amount } from 'sushi'
import { type EvmChainId, type EvmCurrency, EvmNative } from 'sushi/evm'
import type { Fork } from '../fixtures'
import { currencyBalance } from '../fork'
import type { NetworkMocks } from '../intercept-anvil'
import { installSwapRecording } from '../swap/recordings'
import { BaseActions } from './base'

type InputType = 'INPUT' | 'OUTPUT'

export class SwapPage extends BaseActions {
  readonly nativeToken: EvmNative
  constructor(
    page: Page,
    readonly chainId: EvmChainId,
    fork: Fork,
    readonly mocks: NetworkMocks,
  ) {
    super(page, fork)
    this.nativeToken = EvmNative.fromChainId(chainId)
  }

  async goTo(url: string): Promise<void> {
    await this.page.goto(url)
  }

  async prepare(
    input: EvmCurrency,
    output: EvmCurrency,
    amount: Amount<EvmCurrency> | 'max',
  ): Promise<void> {
    await test.step('Select currencies and amount', async () => {
      await this.handleToken(input, 'INPUT')
      await this.handleToken(output, 'OUTPUT')
      await this.inputAmount(amount)
    })
  }

  async wrap(
    input: EvmCurrency,
    output: EvmCurrency,
    amount: Amount<EvmCurrency> | 'max',
  ): Promise<void> {
    await this.prepare(input, output, amount)
    await this.approve(input)
    const button = this.page.locator('[testdata-id=swap-button]')
    await expect(button).toHaveText(input.type === 'native' ? 'Wrap' : 'Unwrap')
    await this.confirm(input, output)
  }

  async swap(
    input: EvmCurrency,
    output: EvmCurrency,
    amount: Amount<EvmCurrency> | 'max',
  ): Promise<void> {
    await this.prepare(input, output, amount)
    await this.approve(input)
    await this.confirm(input, output)
  }

  async approve(currency: EvmCurrency): Promise<void> {
    if (currency.type === 'native') return
    const approve = this.page.locator('[testdata-id=approve-erc20-button]', {
      hasText: `Approve ${currency.symbol}`,
    })
    const swap = this.page.locator('[testdata-id=swap-button]')
    const priceImpact = this.page.locator('[testdata-id=price-impact-checkbox]')
    await expect
      .poll(
        async () =>
          (await approve.isVisible()) ||
          (await swap.isEnabled()) ||
          (await priceImpact.isVisible()),
      )
      .toBe(true)
    if (await approve.isVisible()) {
      await expect(approve).toBeEnabled()
      await this.transact(`Approve ${currency.symbol}`, () => approve.click())
      // Pending toasts can disappear before the next browser turn on Anvil.
      await expect(approve).toBeHidden()
    }
  }

  async review(): Promise<void> {
    const button = this.page.locator('[testdata-id=swap-button]')
    const priceImpact = this.page.locator('[testdata-id=price-impact-checkbox]')
    await expect
      .poll(
        async () => {
          if (
            (await priceImpact.isVisible()) &&
            !(await priceImpact.isChecked())
          )
            await priceImpact.check()
          return button.isEnabled()
        },
        { message: 'Swap becomes actionable', timeout: 10_000 },
      )
      .toBe(true)
    await button.click()
    await expect(
      this.page.locator('[testdata-id=confirm-swap-button]'),
    ).toBeEnabled()
  }

  async confirm(input: EvmCurrency, output: EvmCurrency): Promise<void> {
    await this.review()
    const beforeIn = await currencyBalance(this.fork.client, input)
    const beforeOut = await currencyBalance(this.fork.client, output)
    await this.transact(`Swap ${input.symbol} to ${output.symbol}`, () =>
      this.page.locator('[testdata-id=confirm-swap-button]').click(),
    )
    await test.step('Verify settled balances', async () => {
      expect(await currencyBalance(this.fork.client, input)).toBeLessThan(
        beforeIn,
      )
      expect(await currencyBalance(this.fork.client, output)).toBeGreaterThan(
        beforeOut,
      )
    })
    const another = this.page.locator('[testdata-id=make-another-swap-button]')
    await expect(another).toBeEnabled()
    await another.click()
  }

  async handleToken(currency: EvmCurrency, type: InputType) {
    const selectorInfix = `${type === 'INPUT' ? 'from' : 'to'}`

    // Open token list
    const tokenSelector = this.page.locator(
      `[testdata-id=swap-${selectorInfix}-button]`,
    )
    await expect(tokenSelector).toBeVisible()
    await expect(tokenSelector).toBeEnabled()
    await tokenSelector.click()

    if (currency.type === 'native') {
      const chipToSelect = this.page.locator(
        `[testdata-id=token-selector-chip-${NativeAddress}]`,
      )
      await expect(chipToSelect).toBeVisible()

      await chipToSelect.click()
      await expect(tokenSelector).toContainText(currency.symbol as string)
    } else {
      const tokenSearch = this.page.locator(
        `[testdata-id=token-selector-address-input]`,
      )
      await expect(tokenSearch).toBeVisible()
      await expect(tokenSearch).toBeEnabled()
      await tokenSearch.fill(currency.address)

      const tokenToSelect = this.page.locator(
        `[testdata-id=token-selector-row-${currency.address.toLowerCase()}]`,
      )
      await expect(tokenToSelect).toBeVisible()

      await tokenToSelect.click()
      await expect(tokenSelector).toContainText(currency.symbol as string)
    }
  }

  async maxInput() {
    const maxButton = this.page.locator(
      '[testdata-id=swap-from-balance-button]',
    )
    await expect(maxButton).toBeVisible()
    await expect(maxButton).toBeEnabled()
    await maxButton.click()
  }

  async inputAmount(amount: Amount<EvmCurrency> | 'max') {
    if (amount === 'max') {
      const maxButton = this.page.locator(
        '[testdata-id=swap-from-balance-button]',
      )
      await expect(maxButton).toBeVisible()
      await expect(maxButton).toBeEnabled()
      await maxButton.click()
    } else {
      const input0 = this.page.locator('[testdata-id=swap-from-input]')
      // Inputs are not rendered until the trade is found
      await expect(input0).toBeVisible()
      await expect(input0).toBeEnabled()
      await input0.fill(amount.toString())
    }
  }

  async mockSwapApi(jsonFile: string): Promise<void> {
    await installSwapRecording(this.mocks, jsonFile)
  }
}
