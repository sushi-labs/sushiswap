import type { EvmAddress } from 'sushi/evm'
import type { PublicClient } from 'viem'
import { erc20Abi } from 'viem'
import { LAYERZERO_OFT_ABI } from './abi'
import {
  LAYERZERO_USDT0_EVM_DEPLOYMENTS,
  type LayerZeroEvmChainId,
} from './config'
import type { LayerZeroSendParam } from './types'

export interface LayerZeroEvmSendContractParameters {
  account: EvmAddress
  address: EvmAddress
  abi: typeof LAYERZERO_OFT_ABI
  functionName: 'send'
  args: readonly [
    LayerZeroSendParam,
    { readonly nativeFee: bigint; readonly lzTokenFee: 0n },
    EvmAddress,
  ]
  value: bigint
}

export async function isLayerZeroEvmApprovalRequired({
  publicClient,
  chainId,
  account,
  amount,
}: {
  publicClient: Pick<PublicClient, 'readContract'>
  chainId: LayerZeroEvmChainId
  account: EvmAddress
  amount: bigint
}): Promise<boolean> {
  const deployment = LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId]
  if (!deployment.approvalRequired) return false

  const allowance = await publicClient.readContract({
    address: deployment.tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account, deployment.oftAddress],
  })
  return allowance < amount
}

export function getLayerZeroEvmSendContractParameters({
  chainId,
  account,
  sendParam,
  maxNativeFee,
}: {
  chainId: LayerZeroEvmChainId
  account: EvmAddress
  sendParam: LayerZeroSendParam
  maxNativeFee: bigint
}): LayerZeroEvmSendContractParameters {
  return {
    account,
    address: LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId].oftAddress,
    abi: LAYERZERO_OFT_ABI,
    functionName: 'send',
    args: [sendParam, { nativeFee: maxNativeFee, lzTokenFee: 0n }, account],
    value: maxNativeFee,
  }
}
