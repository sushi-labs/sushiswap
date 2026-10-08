import { getNativeAddress } from 'sushi'
import { EvmChainId, EvmNative } from 'sushi/evm'
import { SvmChainId, SvmNative } from 'sushi/svm'
import { zeroAddress } from 'viem'
import { describe, expect, it } from 'vitest'
import { isLifiNativeToken } from './is-lifi-native-token'

describe('LI.FI native token identification', () => {
  it('recognizes the zero-address native HYPE returned by LI.FI', () => {
    expect(
      isLifiNativeToken({
        chainId: EvmChainId.HYPEREVM,
        address: zeroAddress,
      }),
    ).toBe(true)
  })

  it('recognizes canonical and mixed-case EVM native placeholders', () => {
    for (const address of [
      getNativeAddress(EvmChainId.HYPEREVM),
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      '0xEeEeEeEeEeEeEeEeEeEeEeEeEeEeEeEeEeEeEeEe',
    ] as const) {
      expect(isLifiNativeToken({ chainId: EvmChainId.HYPEREVM, address })).toBe(
        true,
      )
    }
  })

  it('keeps wrapped EVM native assets and bridged HYPE as tokens', () => {
    expect(
      isLifiNativeToken({
        chainId: EvmChainId.HYPEREVM,
        address: EvmNative.fromChainId(EvmChainId.HYPEREVM).wrap().address,
      }),
    ).toBe(false)
    expect(
      isLifiNativeToken({
        chainId: EvmChainId.ROBINHOOD,
        address: '0xd6AdcE5eac5F40d29e2101436C38cF1ceE8F4856',
      }),
    ).toBe(false)
  })

  it('recognizes native SOL using the Sushi native address', () => {
    expect(
      isLifiNativeToken({
        chainId: SvmChainId.SOLANA,
        address: getNativeAddress(SvmChainId.SOLANA),
      }),
    ).toBe(true)
  })

  it('does not mistake wrapped SOL or EVM placeholders for native SOL', () => {
    for (const address of [
      SvmNative.fromChainId(SvmChainId.SOLANA).wrap().address,
      zeroAddress,
      getNativeAddress(EvmChainId.ETHEREUM),
    ]) {
      expect(isLifiNativeToken({ chainId: SvmChainId.SOLANA, address })).toBe(
        false,
      )
    }
  })
})
