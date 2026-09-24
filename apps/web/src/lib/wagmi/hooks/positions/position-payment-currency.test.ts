import { Amount, Percent } from 'sushi'
import {
  EvmChainId,
  EvmNative,
  EvmToken,
  NonfungiblePositionManager,
  Position,
  SushiSwapV3FeeAmount,
  SushiSwapV3Pool,
  USDC,
  WNATIVE,
  encodeSqrtRatioX96,
  nonfungiblePositionManagerAbi_collect,
} from 'sushi/evm'
import { type Hex, decodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'
import {
  getPositionCurrency,
  getPositionNativePaymentCurrency,
} from './position-payment-currency'

const recipient = '0x0000000000000000000000000000000000000001'
const arcUsdc = USDC[EvmChainId.ARC]
const arcToken = new EvmToken({
  chainId: EvmChainId.ARC,
  address: '0x5000000000000000000000000000000000000000',
  decimals: 6,
  symbol: 'TEST',
  name: 'Test',
})

describe('position payment currencies', () => {
  it('keeps Arc USDC in six-decimal ERC20 form regardless of receive preference', () => {
    for (const receiveWrapped of [false, true]) {
      const token = getPositionCurrency(arcUsdc, receiveWrapped)
      expect(token?.type).toBe('token')
      expect(token?.decimals).toBe(6)
      expect(token?.wrap().address).toBe(arcUsdc.address)
    }
  })

  it('parses Arc position inputs in ERC20 units with no native approval bypass', () => {
    const currency = getPositionCurrency(arcUsdc)!
    expect(currency.type).toBe('token')
    expect(Amount.fromHuman(currency, '1').amount).toBe(1_000_000n)
    expect(currency.wrap().address).toBe(arcUsdc.address)
  })

  it('continues honoring native and wrapped receipts on Ethereum', () => {
    expect(getPositionCurrency(WNATIVE[EvmChainId.ETHEREUM], false)?.type).toBe(
      'native',
    )
    expect(getPositionCurrency(WNATIVE[EvmChainId.ETHEREUM], true)?.type).toBe(
      'token',
    )
    expect(getPositionCurrency(undefined, false)).toBeUndefined()
  })

  it('builds direct ERC20 collect calldata using the currently installed library', () => {
    const currency = getPositionCurrency(arcUsdc, false)!
    const result = NonfungiblePositionManager.collectCallParameters({
      tokenId: 1n,
      recipient,
      expectedCurrencyOwed0: new Amount(currency, 1000000n),
      expectedCurrencyOwed1: new Amount(arcToken, 2000000n),
    })
    expect(result.value).toBe('0x0')
    expect(
      decodeFunctionData({
        abi: nonfungiblePositionManagerAbi_collect,
        data: result.calldata as Hex,
      }).args[0].recipient,
    ).toBe(recipient)
  })

  it('disables native payment instructions on Arc but retains Ethereum native payments', () => {
    expect(
      getPositionNativePaymentCurrency(
        EvmNative.fromChainId(EvmChainId.ARC),
        arcToken,
      ),
    ).toBeUndefined()
    expect(getPositionNativePaymentCurrency(arcUsdc, arcToken)).toBeUndefined()
    const eth = EvmNative.fromChainId(EvmChainId.ETHEREUM)
    expect(
      getPositionNativePaymentCurrency(eth, USDC[EvmChainId.ETHEREUM]),
    ).toBe(eth)
    const pool = new SushiSwapV3Pool(
      arcUsdc,
      arcToken,
      SushiSwapV3FeeAmount.MEDIUM,
      encodeSqrtRatioX96(1, 1),
      0,
      0,
      [],
    )
    const position = new Position({
      pool,
      tickLower: -60,
      tickUpper: 60,
      liquidity: 1000000n,
    })
    const result = NonfungiblePositionManager.addCallParameters(position, {
      recipient,
      deadline: 2000000000n,
      slippageTolerance: new Percent({ numerator: 1, denominator: 100 }),
      useNative: getPositionNativePaymentCurrency(arcUsdc, arcToken),
    })
    expect(result.value).toBe('0x0')
  })
})
