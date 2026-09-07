import { type Page, expect } from '@playwright/test'
import { isZapSupportedChainId } from 'src/config'
import { NativeAddress } from 'src/lib/constants'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  type EvmToken,
  SUSHISWAP_V2_FACTORY_ADDRESS,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
  computeSushiSwapV2PoolAddress,
  computeSushiSwapV3PoolAddress,
} from 'sushi/evm'
import type { TransactionReceipt } from 'viem'
import { graphRequest } from '../api-mocks'
import { transactionTimeout } from '../constants'
import type { Fork } from '../fixtures'
import type { NetworkMocks } from '../intercept-anvil'
import { BaseActions } from './base' // Adjust the import path as necessary

interface CreateV3PoolArgs {
  token0: EvmCurrency
  token1: EvmCurrency
  startPrice: string
  minPrice: string
  maxPrice: string
  amount: string
  amountBelongsToToken0: boolean
}

interface AddV3LiquidityArgs {
  token0: EvmCurrency
  token1: EvmCurrency
  minPrice: string
  maxPrice: string
  amount: string
  amountBelongsToToken0: boolean
}

interface CreateV2PoolArgs {
  token0: EvmCurrency
  token1: EvmCurrency
  amount0: string
  amount1: string
}
interface AddV2LiquidityArgs {
  token0: EvmCurrency
  token1: EvmCurrency
  amount0: string
  amount1: string
}

export class PoolPage extends BaseActions {
  readonly chainId: EvmChainId
  readonly nativeToken: EvmNative
  constructor(page: Page, chainId: EvmChainId, fork: Fork) {
    super(page, fork)
    this.chainId = chainId
    this.nativeToken = EvmNative.fromChainId(chainId)
  }

  async goTo(url: string) {
    await this.page.goto(url)
  }

  async createV3Pool(args: CreateV3PoolArgs): Promise<TransactionReceipt> {
    await this.handleToken(args.token0, 'FIRST')
    await this.handleToken(args.token1, 'SECOND')
    const feeOptionSelector = this.page.locator(
      '[testdata-id=fee-option-10000]',
    )
    await expect(feeOptionSelector).toBeEnabled()
    await feeOptionSelector.click()
    await expect(feeOptionSelector).toHaveAttribute('data-state', 'on')

    const startPriceInput = this.page.locator('[testdata-id=start-price-input]')
    await expect(startPriceInput).toBeVisible()
    await expect(startPriceInput).toBeEnabled()
    await startPriceInput.fill(args.startPrice, { timeout: 15_000 })

    // Fill min price
    const minPriceInput = this.page.locator('[testdata-id=min-price-input]')
    await minPriceInput.fill(args.minPrice)
    // Fill max price
    const maxPriceInput = this.page.locator('[testdata-id=max-price-input]')
    await maxPriceInput.fill(args.maxPrice)

    const tokenOrderNumber = args.amountBelongsToToken0 ? 0 : 1
    await this.page
      .locator(`[testdata-id=add-liquidity-token${tokenOrderNumber}-input]`)
      .fill(args.amount)

    await this.switchNetwork(this.chainId)

    if (
      (args.amountBelongsToToken0 && args.token0.type === 'token') ||
      (!args.amountBelongsToToken0 && args.token1.type === 'token')
    ) {
      const approveTokenLocator = this.page.locator(
        `[testdata-id=${`approve-erc20-${tokenOrderNumber}-button`}]`,
      )
      await this.approveIfNeeded(
        approveTokenLocator,
        this.page.locator('[testdata-id=add-liquidity-preview-button]'),
      )
    }
    const previewLocator = this.page.locator(
      '[testdata-id=add-liquidity-preview-button]',
    )
    await expect(previewLocator).toBeVisible({ timeout: 10_000 })
    await expect(previewLocator).toBeEnabled()
    await previewLocator.click()
    const receipt = await this.transact('Add V3 liquidity', () =>
      this.page.locator('[testdata-id=confirm-add-liquidity-button]').click(),
    )

    const expectedText = `(Created the ${args.token0.symbol}/${args.token1.symbol} liquidity pool)`
    const regex = new RegExp(expectedText)
    await expect(this.page.getByText(regex).first()).toBeVisible({
      timeout: transactionTimeout,
    })
    return receipt
  }

  async createV2Pool(args: CreateV2PoolArgs): Promise<TransactionReceipt> {
    await this.handleToken(args.token0, 'FIRST')
    await this.handleToken(args.token1, 'SECOND')

    const input0 = this.page.locator('[testdata-id=add-liquidity-token0-input]')
    await expect(input0).toBeEnabled()
    await input0.fill(args.amount0)
    await expect(input0).toHaveValue(args.amount0)

    const input1 = this.page.locator('[testdata-id=add-liquidity-token1-input]')
    await expect(input1).toBeEnabled()
    await input1.fill(args.amount1)
    await expect(input1).toHaveValue(args.amount1)

    await this.switchNetwork(this.chainId)

    const approveTokenId = `approve-token-${
      args.token0.type === 'native' ? 1 : 0
    }-button`
    const approveTokenLocator = this.page.locator(
      `[testdata-id=${approveTokenId}]`,
    )
    await this.approveIfNeeded(
      approveTokenLocator,
      this.page.locator('[testdata-id=add-liquidity-button]'),
    )

    const reviewSelector = '[testdata-id=add-liquidity-button]'
    const reviewButton = this.page.locator(reviewSelector)
    await expect(reviewButton).toBeVisible()
    await expect(reviewButton).toBeEnabled()
    await reviewButton.click({ timeout: 2_000 })

    const confirmButton = this.page.locator(
      '[testdata-id=confirm-add-v2-liquidity-button]',
    )
    await expect(confirmButton).toBeVisible()
    await expect(confirmButton).toBeEnabled()
    const receipt = await this.transact('Add V2 liquidity', () =>
      confirmButton.click(),
    )

    const expectedText = `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`
    const regex = new RegExp(expectedText)
    await expect(this.page.getByText(regex).first()).toBeVisible({
      timeout: transactionTimeout,
    })
    return receipt
  }

  async addLiquidityV2(args: AddV2LiquidityArgs): Promise<TransactionReceipt> {
    await this.handleToken(args.token0, 'FIRST')
    await this.handleToken(args.token1, 'SECOND')

    if (isZapSupportedChainId(this.chainId)) {
      const toggleZapLocator = this.page.locator(
        '[testdata-id=toggle-zap-enabled]',
      )
      await expect(toggleZapLocator).toBeVisible()
      await expect(toggleZapLocator).toBeEnabled()
      await toggleZapLocator.click()
    }

    // Only fill in the token that is not native if we are adding liquidity to an existing pool.
    const input = this.page.locator(
      `[testdata-id=add-liquidity-token${args.token0.type === 'native' ? 1 : 0}-input]`,
    )
    await expect(input).toHaveAttribute('data-state', 'active')
    await expect(input).toBeEnabled()
    await input.fill(
      args.token0.type === 'native' ? args.amount1 : args.amount0,
    )
    await expect(input).toHaveValue(
      args.token0.type === 'native' ? args.amount1 : args.amount0,
    )

    if (
      await this.page
        .locator(`[testdata-id=switch-network-${this.chainId}-button]`)
        .first()
        .isVisible()
    ) {
      await this.switchNetwork(this.chainId)
    }

    const approveTokenId = `approve-token-${
      args.token0.type === 'native' ? 1 : 0
    }-button`
    const approveTokenLocator = this.page.locator(
      `[testdata-id=${approveTokenId}]`,
    )
    await this.approveIfNeeded(
      approveTokenLocator,
      this.page.locator('[testdata-id=add-liquidity-button]'),
    )

    const reviewSelector = '[testdata-id=add-liquidity-button]'
    const reviewButton = this.page.locator(reviewSelector)
    await expect(reviewButton).toBeVisible()
    await expect(reviewButton).toBeEnabled()
    await reviewButton.click({ timeout: 2_000 })

    const confirmButton = this.page.locator(
      '[testdata-id=confirm-add-v2-liquidity-button]',
    )
    await expect(confirmButton).toBeVisible()
    await expect(confirmButton).toBeEnabled()
    const receipt = await this.transact('Add V2 liquidity', () =>
      confirmButton.click(),
    )

    const expectedText = `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`
    const regex = new RegExp(expectedText)
    await expect(this.page.getByText(regex).first()).toBeVisible({
      timeout: transactionTimeout,
    })
    return receipt
  }

  async addLiquidityV3(args: AddV3LiquidityArgs): Promise<TransactionReceipt> {
    await this.handleToken(args.token0, 'FIRST')
    await this.handleToken(args.token1, 'SECOND')
    const feeOptionSelector = this.page.locator(
      '[testdata-id=fee-option-10000]',
    )
    await expect(feeOptionSelector).toBeEnabled()
    await feeOptionSelector.click()
    await expect(feeOptionSelector).toHaveAttribute('data-state', 'on')

    const zap = this.page.locator('[testdata-id=toggle-zap-enabled]')
    if (isZapSupportedChainId(this.chainId)) {
      await expect(zap).toBeVisible()
      if ((await zap.getAttribute('data-state')) === 'checked')
        await zap.click()
      await expect(zap).toHaveAttribute('data-state', 'unchecked')
    }

    // Fill min price
    const minPriceInput = this.page.locator('[testdata-id=min-price-input]')
    await minPriceInput.fill(args.minPrice)
    // await expect(minPriceInput).not.toHaveValue(minPriceValueBefore)

    // Fill max price
    const maxPriceInput = this.page.locator('[testdata-id=max-price-input]')

    await maxPriceInput.fill(args.maxPrice)
    // await expect(maxPriceInput).not.toHaveValue(maxPriceValueBefore)

    const tokenOrderNumber = args.amountBelongsToToken0 ? 0 : 1
    await this.page
      .locator(`[testdata-id=add-liquidity-token${tokenOrderNumber}-input]`)
      .fill(args.amount)

    if (
      await this.page
        .locator(`[testdata-id=switch-network-${this.chainId}-button]`)
        .first()
        .isVisible()
    ) {
      await this.switchNetwork(this.chainId)
    }

    if (
      (args.amountBelongsToToken0 && args.token0.type === 'token') ||
      (!args.amountBelongsToToken0 && args.token1.type === 'token')
    ) {
      const approveTokenLocator = this.page.locator(
        `[testdata-id=${`approve-erc20-${tokenOrderNumber}-button`}]`,
      )
      await this.approveIfNeeded(
        approveTokenLocator,
        this.page.locator('[testdata-id=add-liquidity-preview-button]'),
      )
    }
    const previewLocator = this.page.locator(
      '[testdata-id=add-liquidity-preview-button]',
    )
    await expect(previewLocator).toBeVisible({ timeout: 10_000 })
    await expect(previewLocator).toBeEnabled()
    await previewLocator.click()
    const receipt = await this.transact('Add V3 liquidity', () =>
      this.page.locator('[testdata-id=confirm-add-liquidity-button]').click(),
    )

    const expectedText = `(Successfully added liquidity to the ${args.token0.symbol}/${args.token1.symbol} pair)`

    const regex = new RegExp(expectedText)
    await expect(this.page.getByText(regex).first()).toBeVisible({
      timeout: transactionTimeout,
    })
    return receipt
  }

  async removeLiquidityV3(
    fakeToken: EvmToken,
    positionId: bigint,
  ): Promise<void> {
    const poolAddress = computeSushiSwapV3PoolAddress({
      factoryAddress:
        SUSHISWAP_V3_FACTORY_ADDRESS[this.chainId as SushiSwapV3ChainId],
      tokenA: this.nativeToken.wrap(),
      tokenB: fakeToken,
      fee: SushiSwapV3FeeAmount.HIGH,
    })
    const url = `/${this.chainId.toString()}/pool/v3/${poolAddress.toLowerCase()}/${positionId}`
    await this.page.goto(url)
    await this.connect()

    const removeLiquidityTabSelector = this.page.locator(
      '[testdata-id=remove-tab]',
    )
    await expect(removeLiquidityTabSelector).toBeVisible()
    await removeLiquidityTabSelector.click()

    await this.switchNetwork(this.chainId)

    await this.page.locator('[testdata-id=liquidity-max-button]').click()
    const handleLiquidityLocator = this.page.locator(
      '[testdata-id=remove-or-add-liquidity-button]',
    )
    await expect(handleLiquidityLocator).toBeVisible()
    await expect(handleLiquidityLocator).toBeEnabled() // needed, not sure why, my guess is that a web3 call hasn't finished and button shouldn't be enabled yet.
    await handleLiquidityLocator.click()

    const confirmLiquidityLocator = this.page.locator(
      '[testdata-id=confirm-remove-liquidity-button]',
    )
    await expect(confirmLiquidityLocator).toBeVisible()
    await expect(confirmLiquidityLocator).toBeEnabled() // needed, not sure why, my guess is that a web3 call hasn't finished and button shouldn't be enabled yet.
    await this.transact('Remove V3 liquidity', () =>
      confirmLiquidityLocator.click(),
    )

    const regex = /Successfully removed liquidity from the .* pair/
    await expect(this.page.getByText(regex).first()).toBeVisible({
      timeout: transactionTimeout,
    })
  }

  async removeLiquidityV2(fakeToken: EvmToken) {
    const poolAddress = computeSushiSwapV2PoolAddress({
      factoryAddress:
        SUSHISWAP_V2_FACTORY_ADDRESS[this.chainId as SushiSwapV2ChainId],
      tokenA: this.nativeToken.wrap(),
      tokenB: fakeToken,
    })

    const url = `/${this.chainId.toString()}/pool/v2/${poolAddress.toLowerCase()}/remove`
    await this.page.goto(url)
    await this.connect()

    // const removeLiquidityTabSelector = page.locator('[testdata-id=remove-tab]')
    // await expect(removeLiquidityTabSelector).toBeVisible()
    // await removeLiquidityTabSelector.click()

    const removeMaxButtonSelector = this.page.locator(
      '[testdata-id=remove-liquidity-max-button]',
    )
    await expect(removeMaxButtonSelector).toBeVisible()
    await removeMaxButtonSelector.click()

    await this.switchNetwork(this.chainId)

    const selectApprovalTypeId = 'select-approval-type-button'
    const selectApprovalTypeLocator = this.page.locator(
      `[testdata-id=${selectApprovalTypeId}]`,
    )
    await expect(selectApprovalTypeLocator).toBeVisible()
    await selectApprovalTypeLocator.click()

    const selectApproveId = 'approval-type-approve-button'
    const selectApproveLocator = this.page.locator(
      `[testdata-id=${selectApproveId}]`,
    )
    await expect(selectApproveLocator).toBeVisible()
    await selectApproveLocator.click()

    const approveSlpId = 'approve-remove-liquidity-slp-button'
    const approveSlpLocator = this.page.locator(`[testdata-id=${approveSlpId}]`)
    await expect(approveSlpLocator).toBeVisible()
    await expect(approveSlpLocator).toBeEnabled()
    await this.transact('Approve LP token', () => approveSlpLocator.click())

    const removeLiquidityLocator = this.page.locator(
      '[testdata-id=remove-liquidity-button]',
    )

    await expect(removeLiquidityLocator).toBeVisible()
    await expect(removeLiquidityLocator).toBeEnabled()
    await this.transact('Remove V2 liquidity', () =>
      removeLiquidityLocator.click(),
    )

    const regex = /Successfully removed liquidity from the .* pair/
    await expect(this.page.getByText(regex).first()).toBeVisible({
      timeout: transactionTimeout,
    })
  }

  // Private helper methods for internal class use
  private async handleToken(currency: EvmCurrency, order: 'FIRST' | 'SECOND') {
    const selectorInfix = `token${order === 'FIRST' ? 0 : 1}`
    const tokenSelector = this.page.locator(
      `[testdata-id=${selectorInfix}-select-button]`,
    )
    await expect(tokenSelector).toBeVisible()
    const selected = new URL(this.page.url()).searchParams.get(
      order === 'FIRST' ? 'fromCurrency' : 'toCurrency',
    )
    const requested = currency.type === 'native' ? 'NATIVE' : currency.address
    if (selected?.toLowerCase() === requested.toLowerCase()) {
      await expect(tokenSelector).toContainText(currency.symbol ?? '')
      return
    }
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
        '[testdata-id=token-selector-address-input]',
      )
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

  async mockPoolApi(
    mocks: NetworkMocks,
    token0: EvmToken,
    token1: EvmToken,
    fee: number,
    protocol: 'SUSHISWAP_V2' | 'SUSHISWAP_V3',
  ) {
    mocks.add(async (request) => {
      // console.log('REQUEST', request.url.toLowerCase())

      const [tokenA, tokenB] = token0.sortsBefore(token1)
        ? [token0, token1]
        : [token1, token0] // does safety checks

      let address

      if (protocol === 'SUSHISWAP_V3') {
        address = computeSushiSwapV3PoolAddress({
          factoryAddress:
            SUSHISWAP_V3_FACTORY_ADDRESS[this.chainId as SushiSwapV3ChainId],
          tokenA,
          tokenB,
          fee: fee,
        }).toLowerCase()
      } else if (protocol === 'SUSHISWAP_V2') {
        address = computeSushiSwapV2PoolAddress({
          factoryAddress:
            SUSHISWAP_V2_FACTORY_ADDRESS[this.chainId as SushiSwapV2ChainId],
          tokenA,
          tokenB,
        }).toLowerCase()
      } else {
        console.error('>>>>>>>>> UNKNOWN PROTOCOL')
        throw Error('Unknown protocol')
      }
      const mockPool =
        protocol === 'SUSHISWAP_V2'
          ? {
              data: {
                v2Pool: {
                  id: `${this.chainId}:${address}`.toLowerCase(),
                  chainId: this.chainId,
                  name: 'WMATIC / FT',
                  address,
                  createdAt: '1630455405',
                  protocol,
                  // swapFee: fee / (protocol === 'SUSHISWAP_V3' ? 1000000 : 10000),
                  swapFee: fee / 10000,

                  token0: {
                    id: `${tokenA.chainId}:${tokenA.address}`.toLowerCase(),
                    address: tokenA.address.toLowerCase(),
                    name: tokenA.name,
                    symbol: tokenA.symbol,
                    decimals: tokenA.decimals,
                    chainId: tokenA.chainId,
                  },
                  token1: {
                    id: `${tokenB.chainId}:${tokenB.address}`.toLowerCase(),
                    address: tokenB.address.toLowerCase(),
                    name: tokenB.name,
                    symbol: tokenB.symbol,
                    decimals: tokenB.decimals,
                    chainId: tokenB.chainId,
                  },
                  source: 'SUBGRAPH',
                  reserve0: '14632715635223519232',
                  reserve1: '66374911905262165000000',
                  liquidity: '736541498034438406144',
                  volumeUSD: 56162969.922308594,
                  liquidityUSD: 71429.02585542823,
                  token0Price: 0.0002204555187373958,
                  token1Price: 4536.062448004257,
                  volumeUSD1d: 1444.4034653156996,
                  feeUSD1d: 4.333210395940114,
                  txCount1d: 104,
                  feeApr1d: 0.022142564252791732,
                  totalApr1d: 0.022142564252791732,
                  volumeUSD1dChange: -0.43870093251068154,
                  feeUSD1dChange: -0.4387009325124158,
                  txCount1dChange: -0.11864406779661019,
                  liquidityUSD1dChange: 0.01395086513190713,
                  incentiveApr: 0,
                  isIncentivized: false,
                  wasIncentivized: false,
                  incentives: [],
                },
              },
            }
          : {
              data: {
                v3Pool: {
                  id: `${this.chainId}:${address}`.toLowerCase(),
                  chainId: this.chainId,
                  name: 'WMATIC / FT',
                  address,
                  createdAt: '1630455405',
                  protocol,
                  swapFee: fee / 1_000_000,

                  token0: {
                    id: `${tokenA.chainId}:${tokenA.address}`.toLowerCase(),
                    address: tokenA.address.toLowerCase(),
                    name: tokenA.name,
                    symbol: tokenA.symbol,
                    decimals: tokenA.decimals,
                  },
                  token1: {
                    id: `${tokenB.chainId}:${tokenB.address}`.toLowerCase(),
                    address: tokenB.address.toLowerCase(),
                    name: tokenB.name,
                    symbol: tokenB.symbol,
                    decimals: tokenB.decimals,
                  },
                  source: 'SUBGRAPH',
                  reserve0: '97138000822798992',
                  reserve1: '251532847196719',
                  liquidity: '190259449333200569961',
                  sqrtPrice: '77543082754135133119551574769',
                  tick: '-430',
                  observationIndex: '0',
                  feeGrowthGlobal0X128: '1913748811595781336300706674643883',
                  feeGrowthGlobal1X128: '1490989199114543008131607233327172',
                  volumeUSD: 124770.3303415501,
                  liquidityUSD: 327.7942814599597,
                  token0Price: 1.0439339999465262,
                  token1Price: 0.9579149640218858,
                  volumeUSD1d: 0,
                  feeUSD1d: 0,
                  txCount1d: 0,
                  feeApr1d: 0,
                  totalApr1d: 0,
                  volumeUSD1dChange: 0,
                  feeUSD1dChange: 0,
                  txCount1dChange: 0,
                  liquidityUSD1dChange: 0,
                  incentiveApr: 0,
                  isIncentivized: false,
                  wasIncentivized: false,
                  incentives: [],
                },
              },
            }

      if (request.url.toLowerCase().endsWith('/graphql')) {
        const requestBody = graphRequest.parse(await request.json())
        const operationName = requestBody.operationName

        if (operationName === 'V2Pool' || operationName === 'V3Pool') {
          return new Response(JSON.stringify(mockPool), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
      }
    })
  }
}
