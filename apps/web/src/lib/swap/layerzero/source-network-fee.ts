import { EvmChainId, isEvmAddress } from 'sushi/evm'
import { StellarChainId, isStellarAccountAddress } from 'sushi/stellar'
import {
  type Client,
  type PublicClient,
  encodeFunctionData,
  erc20Abi,
} from 'viem'
import { estimateTotalFee } from 'viem/op-stack'
import { LAYERZERO_OFT_ABI } from './abi'
import { LAYERZERO_USDT0_EVM_DEPLOYMENTS } from './config'
import { buildStellarOftSend } from './stellar'
import type { LayerZeroQuote } from './types'

export type LayerZeroSourceNetworkFeeEstimate =
  | { status: 'estimated'; amount: bigint }
  | { status: 'approval-required' }

export type LayerZeroFeeClient = Client &
  Pick<PublicClient, 'readContract' | 'estimateGas' | 'getGasPrice'>

/** Estimates the source send only; the LayerZero messaging fee is separate. */
export async function estimateLayerZeroSourceNetworkFee({
  quote,
  publicClient,
}: {
  quote: LayerZeroQuote
  publicClient?: LayerZeroFeeClient
}): Promise<LayerZeroSourceNetworkFeeEstimate> {
  const { fromChainId, sourceAddress, sendParam, maxNativeFee } = quote
  if (!sourceAddress || !quote.recipient) {
    throw new Error('Connect both wallets to estimate gas')
  }

  if (fromChainId === StellarChainId.STELLAR) {
    if (!isStellarAccountAddress(sourceAddress)) {
      throw new Error('Invalid Stellar source account')
    }
    // This builds and simulates the same send used at execution, without signing
    // or submitting it. The assembled fee includes inclusion and resource fees.
    const transaction = await buildStellarOftSend({
      from: sourceAddress,
      sendParam,
      nativeFee: maxNativeFee,
    })
    if (!transaction.built) {
      throw new Error('Stellar transaction was not prepared')
    }
    const amount = BigInt(transaction.built.fee)
    if (amount <= 0n) throw new Error('Invalid Stellar network fee')
    return { status: 'estimated', amount }
  }

  if (!publicClient || publicClient.chain?.id !== fromChainId) {
    throw new Error('Source network unavailable')
  }
  if (!isEvmAddress(sourceAddress)) {
    throw new Error('Invalid EVM source account')
  }
  const deployment = LAYERZERO_USDT0_EVM_DEPLOYMENTS[fromChainId]
  if (deployment.approvalRequired) {
    const allowance = await publicClient.readContract({
      address: deployment.tokenAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [sourceAddress, deployment.oftAddress],
    })
    if (allowance < quote.amountSent) return { status: 'approval-required' }
  }
  const request = {
    account: sourceAddress,
    to: deployment.oftAddress,
    data: encodeFunctionData({
      abi: LAYERZERO_OFT_ABI,
      functionName: 'send',
      args: [
        sendParam,
        { nativeFee: maxNativeFee, lzTokenFee: 0n },
        sourceAddress,
      ],
    }),
    value: maxNativeFee,
  }
  // Optimism also charges L1 data and operator fees, beyond execution gas.
  if (fromChainId === EvmChainId.OPTIMISM) {
    return {
      status: 'estimated',
      amount: await estimateTotalFee(publicClient, {
        ...request,
        chain: publicClient.chain,
      }),
    }
  }
  const [gas, gasPrice] = await Promise.all([
    publicClient.estimateGas(request),
    publicClient.getGasPrice(),
  ])
  return { status: 'estimated', amount: gas * gasPrice }
}
