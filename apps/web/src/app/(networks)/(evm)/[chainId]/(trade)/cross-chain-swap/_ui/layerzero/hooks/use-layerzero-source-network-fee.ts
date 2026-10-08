import {
  type TransactionMessageBytesBase64,
  getBase64Decoder,
} from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { getSvmRpc } from 'src/lib/svm/rpc'
import {
  buildValueTransferStellarTransaction,
  isValueTransferApproval,
  validateValueTransferSolanaTransaction,
} from 'src/lib/swap/value-transfer/execution'
import { valueTransferBuildUserStepsResponseSchema } from 'src/lib/swap/value-transfer/schemas'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { EvmChainId, isEvmAddress } from 'sushi/evm'
import { isStellarAccountAddress } from 'sushi/stellar'
import {
  type Client,
  type PublicClient,
  decodeFunctionData,
  erc20Abi,
} from 'viem'
import { estimateTotalFee } from 'viem/op-stack'

export type LayerZeroSourceNetworkFee =
  | { status: 'estimated'; amount: bigint }
  | {
      status: 'connect-wallet' | 'loading' | 'unavailable' | 'approval-required'
    }

type FeeClient = Client &
  Pick<PublicClient, 'estimateGas' | 'getGasPrice' | 'readContract'>

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
  if (!steps.some((step) => !isValueTransferApproval(step))) {
    return { status: 'unavailable' }
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
    const encoded = step.transaction.encoded
    if (step.chainType === 'EVM' && 'to' in encoded) {
      if (
        !publicClient ||
        publicClient.chain?.id !== quote.fromChainId ||
        !isEvmAddress(quote.sourceAddress) ||
        encoded.chainId !== quote.fromChainId
      )
        throw new Error('Source network unavailable')
      if (isValueTransferApproval(step)) {
        const approval = decodeFunctionData({
          abi: erc20Abi,
          data: encoded.data,
        })
        if (approval.functionName !== 'approve')
          throw new Error('Invalid token approval')
        const [spender] = approval.args
        const allowance = await publicClient.readContract({
          address: encoded.to,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [quote.sourceAddress, spender],
        })
        if (allowance < quote.amountIn) return { status: 'approval-required' }
        // A cached quote can retain satisfied approvals. Approval gas is
        // separate from the transfer's network fee.
        continue
      }
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
  const sourceClientReady =
    quote?.srcChain.chainType !== 'EVM' ||
    publicClient?.chain?.id === quote.fromChainId
  const query = useQuery({
    queryKey: [
      'value-transfer-source-network-fee',
      quote?.quote.id,
      quote?.sourceAddress,
      quote?.recipient,
      quote?.fromChainId,
      publicClient?.chain?.id,
    ],
    queryFn: () => {
      if (!quote) throw new Error('No LayerZero quote')
      return estimateValueTransferSourceNetworkFee(quote, publicClient)
    },
    enabled: enabled && connected && sourceClientReady,
    staleTime: 20_000,
    refetchInterval: (query) =>
      query.state.data?.status === 'approval-required' ? 5_000 : false,
    retry: false,
  })
  if (!connected) return { status: 'connect-wallet' }
  if (!enabled || !sourceClientReady || query.isError)
    return { status: 'unavailable' }
  return query.data ?? { status: 'loading' }
}
