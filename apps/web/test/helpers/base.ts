import { type Page, expect } from '@playwright/test'
import { createERC20 } from 'test/erc20'

export class BaseActions {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connect() {
    const connectSelector = this.page
      .locator('[testdata-id=connect-button]')
      .first()
    const connectedWalletSelector = this.page
      .locator('[data-sidebar-trigger]:not([testdata-id=connect-button])')
      .first()

    await expect(
      connectSelector.or(connectedWalletSelector).first(),
    ).toBeVisible()

    if (await connectedWalletSelector.isVisible()) return

    if (await connectSelector.isDisabled()) {
      // E2E uses wagmi's mock connector, which can be ready before Privy's
      // wallet state. Dispatch the test button's keyboard handler when the
      // production loading guard is still active.
      await connectSelector.dispatchEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
      })
    } else {
      await connectSelector.click({ delay: 500 })
    }

    await expect(connectedWalletSelector).toBeVisible()
  }

  async selectNetwork(chainId: number) {
    const networkToSelect = this.page.locator(
      `[testdata-id=network-selector-${chainId}]`,
    )
    await expect(networkToSelect).toBeVisible()
    await expect(networkToSelect).toBeEnabled()
    await networkToSelect.click()
  }

  async switchNetwork(chainId: number) {
    const switchNetworkBtn = this.page.locator(
      `[testdata-id=switch-network-${chainId}-button]`,
    )
    await expect(switchNetworkBtn).toBeVisible()
    await expect(switchNetworkBtn).toBeEnabled()
    await switchNetworkBtn.click()
  }

  async deployFakeToken(details: {
    chainId: number
    name: string
    symbol: string
    decimals: number
  }) {
    let fakeToken
    try {
      fakeToken = await createERC20({
        chainId: details.chainId,
        name: details.name,
        symbol: details.symbol,
        decimals: details.decimals,
      })
      console.log(`Token created: ${details.name} (${details.symbol})`)
      return fakeToken
    } catch (error) {
      console.error('Error creating fake token', details, error)
      throw new Error('Failed to create fake token')
    }
  }
}
