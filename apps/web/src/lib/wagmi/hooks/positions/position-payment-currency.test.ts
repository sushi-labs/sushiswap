import { Amount } from 'sushi'
import {
  EvmChainId,
  EvmNative,
  USDC,
  WETH9,
  nonfungiblePositionManagerAbi_collect,
} from 'sushi/evm'
import { decodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'
import { getCollectFeesCalls } from './actions/get-collect-fees-calls'
import { getPositionManagers } from './position-manager'
import {
  getPositionCurrency,
  getPositionNativePaymentCurrency,
} from './position-payment-currency'

describe('position currencies', () => {
  it.each([false, true])(
    'keeps Arc USDC at six decimals (receiveWrapped=%s)',
    (receiveWrapped) => {
      const usdc = USDC[EvmChainId.ARC]
      const currency = getPositionCurrency(usdc, receiveWrapped)
      expect(currency).toBe(usdc)
      expect(currency.type).toBe('token')
      expect(currency.decimals).toBe(6)
      expect(new Amount(currency, 1_000_000n).toString()).toBe('1')
      expect(
        getPositionNativePaymentCurrency(currency, WETH9[EvmChainId.ARC]),
      ).toBeUndefined()
    },
  )

  it('normalizes Arc native currency to its ERC20 interface before assigning on-chain position amounts', () => {
    const currency = getPositionCurrency(EvmNative.fromChainId(EvmChainId.ARC))
    expect(currency.isSame(USDC[EvmChainId.ARC])).toBe(true)
    expect(currency.decimals).toBe(6)
  })

  it('preserves native and wrapped choices on Ethereum', () => {
    const weth = WETH9[EvmChainId.ETHEREUM]
    const native = EvmNative.fromChainId(EvmChainId.ETHEREUM)
    expect(getPositionCurrency(weth).isSame(native)).toBe(true)
    expect(getPositionCurrency(weth, true)).toBe(weth)
    expect(getPositionCurrency(native, true).isSame(weth)).toBe(true)
    expect(getPositionCurrency(USDC[EvmChainId.ETHEREUM])).toBe(
      USDC[EvmChainId.ETHEREUM],
    )
  })

  it.each(getPositionManagers(EvmChainId.ARC))(
    'collects Arc USDC directly without an unwrap call on %s',
    (positionManager) => {
      const recipient = '0x0000000000000000000000000000000000000001'
      const [call] = getCollectFeesCalls({
        chainId: EvmChainId.ARC,
        positions: [
          {
            positionManager,
            tokenId: 196n,
            expectedCurrencyOwed0: new Amount(
              getPositionCurrency(USDC[EvmChainId.ARC]),
              1_000_000n,
            ),
            expectedCurrencyOwed1: new Amount(
              getPositionCurrency(WETH9[EvmChainId.ARC]),
              0n,
            ),
            recipient,
          },
        ],
      })
      const { functionName, args } = decodeFunctionData({
        abi: nonfungiblePositionManagerAbi_collect,
        data: call.data,
      })
      expect(functionName).toBe('collect')
      expect(args[0].recipient).toBe(recipient)
      expect(args[0].tokenId).toBe(196n)
      expect(call.to).toBe(positionManager)
      expect(call.value).toBe(0n)
    },
  )
})
