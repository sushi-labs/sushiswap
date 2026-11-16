import { USDC } from 'sushi/evm'
import {
  ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS,
  type AnyTokenAnyChainDepositChainId,
} from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import {
  LIFI_PERPS_CHAIN_ID,
  LIFI_PERPS_USDC_ADDRESS,
  type LifiPerpsPreparedStep,
  type LifiPerpsRoute,
  type LifiPerpsStep,
} from './lifi-perps-schemas'

export const wallet = '0x0000000000000000000000000000000000000001'
export const router = '0x0000000000000000000000000000000000000002'
export const otherWallet = '0x0000000000000000000000000000000000000003'

export function createPerpsStep(
  chainId: AnyTokenAnyChainDepositChainId = ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS[0],
): LifiPerpsStep {
  const fromToken = {
    address:
      Object.values(USDC).find((token) => token.chainId === chainId)?.address ??
      '0x0000000000000000000000000000000000000000',
    chainId,
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }
  const toToken = {
    address: LIFI_PERPS_USDC_ADDRESS,
    chainId: LIFI_PERPS_CHAIN_ID,
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin (Perps)',
  } as const
  return {
    id: 'deposit:0',
    type: 'lifi',
    tool: 'layerswap',
    toolDetails: {
      key: 'layerswap',
      name: 'Layerswap',
      logoURI: 'https://example.com/icon.svg',
    },
    action: {
      fromChainId: chainId,
      fromToken,
      fromAmount: '100000000',
      fromAddress: wallet,
      toChainId: LIFI_PERPS_CHAIN_ID,
      toToken,
      toAddress: wallet,
      slippage: 0.005,
    },
    estimate: {
      fromAmount: '100000000',
      toAmount: '99000000',
      toAmountMin: '98000000',
      approvalAddress: router,
      executionDuration: 30,
    },
    executionType: 'transaction',
    includedSteps: [
      {
        type: 'cross',
        tool: 'layerswap',
        action: {
          fromChainId: chainId,
          toChainId: LIFI_PERPS_CHAIN_ID,
          toToken,
          toAddress: wallet,
          destinationGasConsumption: '0',
        },
        protocolData: { opaqueField: 'preserve-this' },
      },
    ],
  }
}

export function createPerpsRoute(
  chainId: AnyTokenAnyChainDepositChainId = ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS[0],
): Omit<LifiPerpsRoute, 'step'> & { steps: LifiPerpsStep[] } {
  const step = createPerpsStep(chainId)
  return {
    id: 'deposit',
    fromChainId: chainId,
    fromToken: step.action.fromToken,
    fromAddress: wallet,
    fromAmount: step.action.fromAmount,
    toChainId: LIFI_PERPS_CHAIN_ID,
    toToken: step.action.toToken,
    toAddress: wallet,
    toAmount: step.estimate.toAmount,
    toAmountMin: step.estimate.toAmountMin,
    containsSwitchChain: false,
    steps: [step],
  }
}

export function createPreparedPerpsStep(
  step: LifiPerpsStep = createPerpsStep(),
): LifiPerpsPreparedStep {
  return {
    ...step,
    transactionRequest: {
      chainId: step.action.fromChainId,
      from: wallet,
      to: router,
      data: '0x12345678',
      value: '0x0',
      gasPrice: '0x1',
      gasLimit: '0x10000',
    },
  }
}
