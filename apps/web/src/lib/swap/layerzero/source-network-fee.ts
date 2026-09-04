import { EvmChainId, isEvmAddress } from 'sushi/evm'
import { StellarChainId, isStellarAccountAddress } from 'sushi/stellar'
import { type Client, type PublicClient, encodeFunctionData } from 'viem'
import { estimateTotalFee } from 'viem/op-stack'
import {
  getLayerZeroEvmSendContractParameters,
  isLayerZeroEvmApprovalRequired,
} from './evm-send'
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
  if (
    await isLayerZeroEvmApprovalRequired({
      publicClient,
      chainId: fromChainId,
      account: sourceAddress,
      amount: sendParam.amountLD,
    })
  )
    return { status: 'approval-required' }

  const contractParameters = getLayerZeroEvmSendContractParameters({
    chainId: fromChainId,
    account: sourceAddress,
    sendParam,
    maxNativeFee,
  })
  const request = {
    account: contractParameters.account,
    to: contractParameters.address,
    data: encodeFunctionData(contractParameters),
    value: contractParameters.value,
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
