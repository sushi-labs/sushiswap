import {
  type TransactionMessageBytesBase64,
  getBase64Decoder,
} from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { getSvmRpc } from 'src/lib/svm/rpc'
import {
  buildValueTransferStellarTransaction,
  validateValueTransferSolanaTransaction,
} from 'src/lib/swap/value-transfer/execution'
import { valueTransferBuildUserStepsResponseSchema } from 'src/lib/swap/value-transfer/schemas'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { EvmChainId, isEvmAddress } from 'sushi/evm'
import { isStellarAccountAddress } from 'sushi/stellar'
import type { Client, PublicClient } from 'viem'
import { estimateTotalFee } from 'viem/op-stack'

export type LayerZeroSourceNetworkFee =
  | { status: 'estimated'; amount: bigint }
  | {
      status: 'connect-wallet' | 'loading' | 'unavailable' | 'approval-required'
    }

type FeeClient = Client & Pick<PublicClient, 'estimateGas' | 'getGasPrice'>

export async function estimateValueTransferSourceNetworkFee(
  quote: ValueTransferTrade,
  publicClient?: FeeClient,
): Promise<LayerZeroSourceNetworkFee> {
  if (!quote.sourceAddress || !quote.recipient)
    return { status: 'connect-wallet' }
  let steps = quote.quote.userSteps
  if (!steps?.length) {
    const response = await fetch(
      '/api/cross-chain/value-transfer/build-user-steps',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.quote.id }),
      },
    )
    if (!response.ok) throw new Error('Transaction fee unavailable')
    steps = valueTransferBuildUserStepsResponseSchema.parse(
      await response.json(),
    ).userSteps
  }
  let amount = 0n
  for (const step of steps) {
    const sameSigner =
      quote.srcChain.chainType === 'EVM'
        ? step.signerAddress.toLowerCase() === quote.sourceAddress.toLowerCase()
        : step.signerAddress === quote.sourceAddress
    if (step.chainKey !== quote.srcChain.chainKey || !sameSigner)
      throw new Error('Invalid source transaction')
    if (step.type === 'SIGNATURE') continue
    if (step.description.toLowerCase().includes('approve'))
      return { status: 'approval-required' }
    const encoded = step.transaction.encoded
    if (step.chainType === 'EVM' && 'to' in encoded) {
      if (
        !publicClient ||
        publicClient.chain?.id !== quote.fromChainId ||
        !isEvmAddress(quote.sourceAddress) ||
        encoded.chainId !== quote.fromChainId
      )
        throw new Error('Source network unavailable')
      const request = {
        account: quote.sourceAddress,
        to: encoded.to,
        data: encoded.data,
        value: BigInt(encoded.value ?? '0'),
      }
      if (quote.fromChainId === EvmChainId.OPTIMISM) {
        amount += await estimateTotalFee(publicClient, {
          ...request,
          chain: publicClient.chain,
        })
      } else {
        const [gas, gasPrice] = await Promise.all([
          publicClient.estimateGas(request),
          publicClient.getGasPrice(),
        ])
        amount += gas * gasPrice
      }
    } else if (step.chainType === 'STELLAR' && 'operationsXDR' in encoded) {
      if (!isStellarAccountAddress(quote.sourceAddress))
        throw new Error('Invalid Stellar source wallet')
      const transaction = await buildValueTransferStellarTransaction({
        ...encoded,
        sourceAddress: quote.sourceAddress,
      })
      amount += BigInt(transaction.fee)
    } else if (step.chainType === 'SOLANA' && 'encoding' in encoded) {
      const transaction = validateValueTransferSolanaTransaction(
        encoded.data,
        quote.sourceAddress,
      )
      const message = getBase64Decoder().decode(
        transaction.messageBytes,
      ) as TransactionMessageBytesBase64
      const { value } = await getSvmRpc().getFeeForMessage(message).send()
      if (value === null) throw new Error('Solana network fee unavailable')
      amount += value
    }
  }
  return { status: 'estimated', amount }
}

export function useLayerZeroSourceNetworkFee({
  quote,
  enabled,
  publicClient,
}: {
  quote: ValueTransferTrade | undefined
  enabled: boolean
  publicClient: FeeClient | undefined
}): LayerZeroSourceNetworkFee {
  const connected = Boolean(quote?.sourceAddress && quote.recipient)
  const query = useQuery({
    queryKey: [
      'value-transfer-source-network-fee',
      quote?.quote.id,
      quote?.sourceAddress,
      quote?.recipient,
    ],
    queryFn: () => {
      if (!quote) throw new Error('No LayerZero quote')
      return estimateValueTransferSourceNetworkFee(quote, publicClient)
    },
    enabled: enabled && connected,
    staleTime: 20_000,
    retry: false,
  })
  if (!connected) return { status: 'connect-wallet' }
  if (!enabled || query.isError) return { status: 'unavailable' }
  return query.data ?? { status: 'loading' }
}
