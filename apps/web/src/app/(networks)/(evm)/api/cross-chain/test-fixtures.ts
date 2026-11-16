import { EvmChainId, USDC } from 'sushi/evm'
import { SvmChainId, WSOL } from 'sushi/svm'
import type { z } from 'zod'
import {
  LIFI_SOLANA_CHAIN_ID,
  type LifiChainId,
  type Step,
  type stepSchema,
} from './schemas'

export const swapSender = '0x0000000000000000000000000000000000000001'
export const swapRecipient = '0x0000000000000000000000000000000000000002'
export const swapRouter = '0x0000000000000000000000000000000000000003'

const bridgeStep = {
  id: 'swap-bridge',
  type: 'cross',
  tool: 'across',
  toolDetails: { key: 'across', name: 'Across', logoURI: '' },
  action: {
    fromChainId: EvmChainId.ETHEREUM,
    toChainId: EvmChainId.ARBITRUM,
    fromAddress: swapSender,
    toAddress: swapRecipient,
    fromAmount: '100000000',
    fromToken: {
      chainId: EvmChainId.ETHEREUM,
      address: USDC[EvmChainId.ETHEREUM].address,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      priceUSD: '1',
    },
    toToken: {
      chainId: EvmChainId.ARBITRUM,
      address: USDC[EvmChainId.ARBITRUM].address,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      priceUSD: '1',
    },
    slippage: 0.005,
  },
  estimate: {
    tool: 'across',
    fromAmount: '100000000',
    toAmount: '99500000',
    toAmountMin: '99002500',
    approvalAddress: swapRouter,
    feeCosts: [],
    gasCosts: [],
    executionDuration: 20,
  },
} satisfies Omit<
  Step<typeof EvmChainId.ETHEREUM, typeof EvmChainId.ARBITRUM, 'lifi'>,
  'includedSteps' | 'includedStepsWithoutFees'
>

export const evmSwapStep = {
  ...bridgeStep,
  id: 'swap-route-step',
  type: 'lifi',
  includedSteps: [bridgeStep],
} satisfies Step<typeof EvmChainId.ETHEREUM, typeof EvmChainId.ARBITRUM, 'lifi'>

type SwapStepFixture = z.input<
  ReturnType<typeof stepSchema<LifiChainId, LifiChainId, 'lifi'>>
>

export function createSolanaSwapStep(
  direction: 'source' | 'destination',
  flavor: 'sushi' | 'lifi',
): SwapStepFixture {
  const solanaChainId =
    flavor === 'lifi' ? LIFI_SOLANA_CHAIN_ID : SvmChainId.SOLANA
  const solanaToken = {
    chainId: solanaChainId,
    address: WSOL[SvmChainId.SOLANA].address,
    name: 'Wrapped SOL',
    symbol: 'SOL',
    decimals: 9,
    priceUSD: '100',
  }
  const action = {
    ...evmSwapStep.action,
    ...(direction === 'source'
      ? {
          fromChainId: solanaChainId,
          fromToken: solanaToken,
          fromAddress: solanaToken.address,
        }
      : {
          toChainId: solanaChainId,
          toToken: solanaToken,
          toAddress: solanaToken.address,
        }),
  }
  return {
    ...evmSwapStep,
    action,
    includedSteps: [{ ...bridgeStep, action }],
  }
}
