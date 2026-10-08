import {
  type UseQueryResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  isValueTransferApproval,
  validateValueTransferUserSteps,
} from 'src/lib/swap/value-transfer/execution'
import {
  type ValueTransferMetadataResponse,
  type ValueTransferUserStep,
  valueTransferBuildUserStepsResponseSchema,
  valueTransferMetadataResponseSchema,
} from 'src/lib/swap/value-transfer/schemas'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { Amount } from 'sushi'
import { type EvmAddress, EvmToken } from 'sushi/evm'
import { decodeFunctionData, erc20Abi } from 'viem'

export interface ValueTransferApproval {
  amount: Amount<EvmToken>
  contract: EvmAddress
}

export function getValueTransferApprovals(
  quote: ValueTransferTrade,
  steps: readonly ValueTransferUserStep[],
  metadata: ValueTransferMetadataResponse,
): ValueTransferApproval[] {
  if (quote.srcChain.chainType !== 'EVM' || !(quote.token0 instanceof EvmToken))
    return []
  if (
    quote.token0.chainId !== quote.fromChainId ||
    quote.token0.address.toLowerCase() !==
      quote.quoteRequest.srcTokenAddress.toLowerCase()
  )
    throw new Error('The approval token does not match the selected token')
  validateValueTransferUserSteps(quote, steps, metadata)
  const approvals = new Map<string, ValueTransferApproval>()
  for (const step of steps) {
    if (
      step.type !== 'TRANSACTION' ||
      step.chainType !== 'EVM' ||
      !isValueTransferApproval(step)
    )
      continue
    const decoded = decodeFunctionData({
      abi: erc20Abi,
      data: step.transaction.encoded.data,
    })
    if (decoded.functionName !== 'approve')
      throw new Error('Invalid token approval')
    const [spender] = decoded.args
    // Reuse Sushi's allowance checks once per spender for the full input amount.
    approvals.set(spender.toLowerCase(), {
      amount: new Amount(quote.token0, quote.amountIn),
      contract: spender,
    })
  }
  return [...approvals.values()]
}

export function useValueTransferApprovals({
  quote,
  enabled,
}: {
  quote: ValueTransferTrade | null | undefined
  enabled: boolean
}): UseQueryResult<ValueTransferApproval[], Error> {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: [
      'value-transfer-approvals',
      quote?.quote.id,
      quote?.sourceAddress,
      quote?.recipient,
      quote?.fromChainId,
      quote?.token0.id,
      quote?.amountIn.toString(),
    ],
    initialData: () => {
      const cached = queryClient.getQueryState<ValueTransferMetadataResponse>([
        'value-transfer-metadata',
      ])
      if (!quote?.quote.userSteps?.length || !cached?.data) return undefined
      try {
        // Quotes refresh while a wallet approval may be pending. Revalidate
        // against cached deployments without unmounting the ERC20 checker.
        // Stale metadata refreshes in the background via initialDataUpdatedAt.
        return getValueTransferApprovals(
          quote,
          quote.quote.userSteps,
          cached.data,
        )
      } catch {
        // The query below reports validation errors and keeps approval blocked.
        return undefined
      }
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(['value-transfer-metadata'])?.dataUpdatedAt,
    queryFn: async ({ signal }) => {
      if (!quote) throw new Error('No LayerZero quote')
      let steps = quote.quote.userSteps
      if (!steps?.length) {
        const response = await fetch(
          '/api/cross-chain/value-transfer/build-user-steps',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quoteId: quote.quote.id }),
            signal,
          },
        )
        if (!response.ok)
          throw new Error('LayerZero approval steps unavailable')
        steps = valueTransferBuildUserStepsResponseSchema.parse(
          await response.json(),
        ).userSteps
      }
      const metadata = await queryClient.fetchQuery({
        queryKey: ['value-transfer-metadata'],
        queryFn: async ({ signal }) => {
          const response = await fetch(
            '/api/cross-chain/value-transfer/metadata',
            { signal },
          )
          if (!response.ok)
            throw new Error('LayerZero contract metadata unavailable')
          return valueTransferMetadataResponseSchema.parse(
            await response.json(),
          )
        },
        staleTime: 60_000,
      })
      return getValueTransferApprovals(quote, steps, metadata)
    },
    enabled:
      enabled &&
      Boolean(
        quote?.sourceAddress &&
          quote.recipient &&
          quote.srcChain.chainType === 'EVM' &&
          quote.token0 instanceof EvmToken,
      ),
    staleTime: 20_000,
    retry: false,
  })
}
