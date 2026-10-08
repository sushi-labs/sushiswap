import { EvmChainId, USDC } from 'sushi/evm'
import type { ValueTransferChain, ValueTransferQuote } from './schemas'
import { type ValueTransferTrade, normalizeValueTransferTrade } from './trade'

export const valueTransferTestSource =
  '0x000000000000000000000000000000000000dEaD'
const nativeAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export function valueTransferTestChain(chainId: 1 | 42161): ValueTransferChain {
  const chainKey = chainId === 1 ? 'ethereum' : 'arbitrum'
  return {
    chainId,
    chainKey,
    chainType: 'EVM',
    name: chainKey,
    shortName: chainKey,
    nativeCurrency: {
      chainKey,
      address: nativeAddress,
      decimals: 18,
      symbol: 'ETH',
      name: 'Ether',
    },
  }
}
export function valueTransferTestQuote(
  overrides: Partial<ValueTransferQuote> = {},
): ValueTransferQuote {
  return {
    id: 'quote-1',
    srcAmount: '2000000',
    dstAmount: '1900000',
    dstAmountMin: '1890500',
    srcAmountUsd: '2',
    dstAmountUsd: '1.9',
    feeUsd: '0.1',
    feePercent: '5',
    duration: { estimated: '120000' },
    fees: [
      {
        chainKey: 'ethereum',
        type: 'MESSAGE',
        description: '',
        amount: '1000',
        address: nativeAddress,
      },
      {
        chainKey: 'ethereum',
        type: 'GENERAL',
        description: '',
        amount: '100000',
        address: USDC[EvmChainId.ETHEREUM].address,
      },
    ],
    routeSteps: [{ type: 'OFT', srcChainKey: 'ethereum', description: 'OFT' }],
    userSteps: [],
    ...overrides,
  }
}
export function valueTransferTestTrade(
  overrides: Partial<ValueTransferTrade> = {},
): ValueTransferTrade {
  return {
    ...normalizeValueTransferTrade({
      quote: valueTransferTestQuote(),
      quoteRequest: {
        srcChainKey: 'ethereum',
        dstChainKey: 'arbitrum',
        srcTokenAddress: USDC[1].address,
        dstTokenAddress: USDC[42161].address,
        srcWalletAddress: valueTransferTestSource,
        dstWalletAddress: valueTransferTestSource,
        amount: '2000000',
      },
      srcChain: valueTransferTestChain(1),
      dstChain: valueTransferTestChain(42161),
      token0: USDC[1],
      token1: USDC[42161],
      sourceAddress: valueTransferTestSource,
      recipient: valueTransferTestSource,
    }),
    ...overrides,
  }
}
