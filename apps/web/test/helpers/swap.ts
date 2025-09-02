import { type Page, expect } from '@playwright/test'
import { NativeAddress } from 'src/lib/constants'
import { getNetworkName } from 'src/lib/network'
import { API_BASE_URL } from 'src/lib/swap/api-base-url'
import { type Amount, getChainById } from 'sushi'
import { type EvmChainId, type EvmCurrency, EvmNative } from 'sushi/evm'
import { BaseActions } from './base' // Adjust the import path as necessary

type InputType = 'INPUT' | 'OUTPUT'

export class SwapPage extends BaseActions {
  readonly chainId: EvmChainId
  readonly nativeToken: EvmNative
  constructor(page: Page, chainId: EvmChainId) {
    super(page)
    this.chainId = chainId
    this.nativeToken = EvmNative.fromChainId(chainId)
  }

  async goTo(url: string) {
    await this.page.goto(url)
  }

  async wrap(
    inputCurrency: EvmCurrency,
    outputCurrency: EvmCurrency,
    amount: Amount<EvmNative> | 'max',
  ) {
    await this.handleToken(inputCurrency, 'INPUT')
    await this.handleToken(outputCurrency, 'OUTPUT')
    await this.inputAmount(amount)

    if (inputCurrency.type === 'token') {
      const approveButton = this.page.locator(
        '[testdata-id=approve-erc20-button]',
        {
          hasText: `Approve ${inputCurrency.symbol}`,
        },
      )
      await expect(approveButton).toBeVisible()
      await expect(approveButton).toBeEnabled()

      await this.page
        .locator('[testdata-id=approve-erc20-button]', {
          hasText: `Approve ${inputCurrency.symbol}`,
        })
        .click()

      const expectedApprovingText = `Approving ${inputCurrency.symbol}`
      expect(this.page.getByText(expectedApprovingText)).toBeVisible()

      const expectedApproveText = `Successfully approved ${inputCurrency.symbol}`
      expect(this.page.getByText(expectedApproveText)).toBeVisible()
    }

    const swapButton = this.page.locator('[testdata-id=swap-button]')
    await expect(swapButton).toBeVisible()
    await expect(swapButton).toBeEnabled()
    await expect(swapButton).toHaveText(
      inputCurrency.type === 'native' ? 'Wrap' : 'Unwrap',
    )
    await swapButton.click()

    const confirmSwapButton = this.page.locator(
      '[testdata-id=confirm-swap-button]',
    )
    await expect(confirmSwapButton).toBeVisible()
    await expect(confirmSwapButton).toBeEnabled()
    await confirmSwapButton.click()

    // If this text is duplicated elsewhere it could false positive
    const expectedText = new RegExp(
      `(${inputCurrency.type === 'native' ? 'Wrap' : 'Unwrap'} .* ${inputCurrency.symbol} to .* ${
        outputCurrency.symbol
      })`,
    )
    expect(this.page.getByText(expectedText)).toBeVisible()

    const makeAnotherSwap = this.page.locator(
      '[testdata-id=make-another-swap-button]',
      {
        hasText: 'Make another swap',
      },
    )
    await expect(makeAnotherSwap).toBeVisible()
    await expect(makeAnotherSwap).toBeEnabled()
    await makeAnotherSwap.click()
  }

  async swap(
    inputCurrency: EvmCurrency,
    outputCurrency: EvmCurrency,
    amount: Amount<EvmCurrency> | 'max',
  ) {
    await this.handleToken(inputCurrency, 'INPUT')
    await this.handleToken(outputCurrency, 'OUTPUT')
    await this.inputAmount(amount)

    // const swapFromBalance = this.page.locator(
    //   '[testdata-id=swap-from-balance-button]',
    // )
    // await expect(swapFromBalance).toBeVisible()
    // await expect(swapFromBalance).toBeEnabled()
    // const swapFromBalanceBefore = await swapFromBalance.textContent()

    // const swapToBalance = this.page.locator(
    //   '[testdata-id=swap-to-balance-button]',
    // )
    // await expect(swapToBalance).toBeVisible()
    // const swapToBalanceBefore = await swapToBalance.textContent()

    await this.approve(inputCurrency)

    const swapButton = this.page.locator('[testdata-id=swap-button]')
    await expect(swapButton).toBeVisible()

    const priceImpactCheckbox = this.page.locator(
      '[testdata-id=price-impact-checkbox]',
    )
    while (!(await swapButton.isEnabled())) {
      if (
        (await priceImpactCheckbox.isVisible()) &&
        !(await priceImpactCheckbox.isChecked())
      ) {
        await priceImpactCheckbox.check()
      }
    }

    await swapButton.isEnabled()

    await swapButton.click()

    const confirmSwap = this.page.locator('[testdata-id=confirm-swap-button]')
    // const confirmSwap = page.getByRole('button', { name: `Swap ${inputCurrency.symbol} for ${outputCurrency.symbol}` })
    await expect(confirmSwap).toBeVisible()
    await expect(confirmSwap).toBeEnabled()
    await confirmSwap.click()

    // If this text is duplicated elsewhere it could false positive
    const expectedSwappingText = new RegExp(
      `(Swapping .* ${inputCurrency.symbol}.* for .* ${outputCurrency.symbol}.*.)`,
    )
    expect(this.page.getByText(expectedSwappingText)).toBeVisible()

    // If this text is duplicated elsewhere it could false positive
    const expectedSwapText = new RegExp(
      `(Swap .* ${inputCurrency.symbol}.* for .* ${outputCurrency.symbol}.*.)`,
    )
    expect(this.page.getByText(expectedSwapText)).toBeVisible()

    // Make another swap
    const makeAnotherSwap = this.page.locator(
      '[testdata-id=make-another-swap-button]',
    )
    await expect(makeAnotherSwap).toBeVisible()
    await expect(makeAnotherSwap).toBeEnabled()
    await makeAnotherSwap.click()

    // Compare against cached balances to ensure there is at least a change...
    // await expect(swapFromBalance).not.toHaveText(
    //   swapFromBalanceBefore as string,
    // )
    // const swapFromBalanceAfter = await swapFromBalance.textContent()
    // expect(swapFromBalanceBefore).not.toEqual(swapFromBalanceAfter)

    // await expect(swapToBalance).not.toHaveText(swapToBalanceBefore as string)
    // const swapToBalanceAfter = await swapToBalance.textContent()
    // expect(swapToBalanceBefore).not.toEqual(swapToBalanceAfter)
  }

  async approve(currency: EvmCurrency) {
    if (currency.type === 'token') {
      const approveButton = this.page.locator(
        '[testdata-id=approve-erc20-button]',
        {
          hasText: `Approve ${currency.symbol}`,
        },
      )
      await expect(approveButton).toBeVisible()
      await expect(approveButton).toBeEnabled()
      await approveButton.click()
      // .then(() => console.log(`Approved ${inputCurrency.symbol}`))
      // .catch(() => console.log(`${inputCurrency.symbol} already approved or not needed`))

      const expectedApprovingText = `Approving ${currency.symbol}`
      await expect(this.page.getByText(expectedApprovingText)).toBeVisible()

      const expectedApproveText = `Successfully approved ${currency.symbol}`
      await expect(this.page.getByText(expectedApproveText)).toBeVisible()
    }
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

    if (type === 'INPUT') {
      const networkOption = this.page.locator(
        `[testdata-id=network-option-${this.chainId}-button]`,
      )
      await expect(networkOption).toBeVisible()
      await expect(networkOption).toBeEnabled()
      await networkOption.click()
      await expect(networkOption).toHaveClass(/border-blue/)
    }

    if (type === 'OUTPUT') {
      const networkMenu = this.page.locator(
        '[testdata-id=network-menu-dropdown-trigger-button]',
      )
      await expect(networkMenu).toBeVisible()
      await expect(networkMenu).toBeEnabled()
      await networkMenu.click()
      const selectNetwork = this.page.locator(
        `[testdata-id=network-menu-dropdown-menu-item-${this.chainId}]`,
      )
      await expect(selectNetwork).toBeVisible()
      await expect(selectNetwork).toBeEnabled()
      await selectNetwork.click()
    }
    // 	await expect(networkMenu).toContainText(getNetworkName(this.chainId));
    // 	const chipSelector = this.page.locator(
    // 		`[testdata-id=token-selector-chip-${
    // 			currency.isNative ? NativeAddress : currency.address.toLowerCase()
    // 		}]`
    // 	);
    // 	await expect(chipSelector).toBeVisible();
    // 	await expect(chipSelector).toBeEnabled();
    // 	await chipSelector.click();
    // 	return;

    if (currency.isNative) {
      const rowToSelect = this.page.locator(
        `[testdata-id=token-selector-row-${NativeAddress}]`,
      )
      await expect(rowToSelect).toBeVisible()

      await rowToSelect.click()
      await expect(tokenSelector).toContainText(currency.symbol as string)
    } else {
      const tokenSearch = this.page.locator(
        `[testdata-id=token-selector-address-input]`,
      )
      await expect(tokenSearch).toBeVisible()
      await expect(tokenSearch).toBeEnabled()
      await tokenSearch.fill(currency.wrap().address)

      const tokenToSelect = this.page.locator(
        `[testdata-id=token-selector-row-${currency.wrap().address.toLowerCase()}]`,
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

  async mockSwapApi(jsonFile: string) {
    await this.page.route(
      `${API_BASE_URL}/quote/v7/${this.chainId}*`,
      (route) => {
        return route.fulfill({ path: jsonFile })
      },
    )
    await this.page.route(
      `${API_BASE_URL}/swap/v7/${this.chainId}*`,
      (route) => {
        return route.fulfill({ path: jsonFile })
      },
    )
  }
}
