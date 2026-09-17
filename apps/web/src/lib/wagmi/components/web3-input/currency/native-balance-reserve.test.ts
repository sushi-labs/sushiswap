import { Amount } from 'sushi'
import { EURC, EvmChainId, EvmNative, EvmToken, USDC } from 'sushi/evm'
import { SvmChainId } from 'sushi/svm'
import { describe, expect, it } from 'vitest'
import {
  getGasBalanceReserve,
  getNativeBalanceReserve,
  getSpendableNativeBalance,
} from './native-balance-reserve'

describe('native balance reserves', () => {
  it('uses chain-native base units', () => {
    expect(getNativeBalanceReserve(EvmChainId.ETHEREUM)).toBe(
      2_000_000_000_000_000n,
    )
    expect(getNativeBalanceReserve(SvmChainId.SOLANA)).toBe(10_000_000n)
  })

  it('reserves 0.01 SOL from Max', () => {
    expect(getSpendableNativeBalance(1_000_000_000n, 10_000_000n)).toBe(
      990_000_000n,
    )
  })

  it('does not spend balances at or below the reserve', () => {
    expect(getSpendableNativeBalance(10_000_000n, 10_000_000n)).toBe(0n)
    expect(getSpendableNativeBalance(1_000n, 10_000_000n)).toBe(0n)
  })

  it.each([
    ['native', EvmNative.fromChainId(EvmChainId.ARC), 10_000_000_000_000_000n],
    ['ERC-20', USDC[EvmChainId.ARC], 10_000n],
  ] as const)(
    'leaves 0.01 USDC when spending Max through the %s interface',
    (_, currency, expectedReserve) => {
      const balance = Amount.fromHuman(currency, '10')
      const reserve = getGasBalanceReserve(currency)
      expect(reserve).toBe(expectedReserve)
      const spendable = new Amount(
        currency,
        getSpendableNativeBalance(balance.amount, reserve),
      )
      expect(spendable.toString()).toBe('9.99')
    },
  )

  it.each([0n, 1n, 9_999n, 10_000n])(
    'does not spend ERC-20 USDC balances at or below the reserve (%s)',
    (balance) => {
      expect(
        getSpendableNativeBalance(
          balance,
          getGasBalanceReserve(USDC[EvmChainId.ARC]),
        ),
      ).toBe(0n)
    },
  )

  it('only reserves gas for canonical USDC on Arc', () => {
    const unrelatedUsdc = new EvmToken({
      chainId: EvmChainId.ARC,
      address: '0x0000000000000000000000000000000000000001',
      decimals: 6,
      symbol: 'USDC',
      name: 'Unrelated USDC',
    })
    expect(getGasBalanceReserve(unrelatedUsdc)).toBe(0n)
    expect(getGasBalanceReserve(EURC[EvmChainId.ARC])).toBe(0n)
    expect(getGasBalanceReserve(USDC[EvmChainId.ETHEREUM])).toBe(0n)
    expect(
      getGasBalanceReserve(EvmNative.fromChainId(EvmChainId.ETHEREUM)),
    ).toBe(2_000_000_000_000_000n)
  })
})
