import { EvmChainId } from 'sushi/evm'
import { SvmChainId } from 'sushi/svm'
import { describe, expect, it } from 'vitest'
import {
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
})
