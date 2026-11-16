import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import { z } from 'zod'
import type { AnyTokenAnyChainDepositChainId } from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import {
  LIFI_PERPS_CHAIN_ID,
  LIFI_PERPS_USDC_ADDRESS,
  LIFI_PERPS_USDC_DECIMALS,
} from './lifi-perps-schemas'

const httpUrlSchema = z
  .string()
  .url()
  .refine((url) => /^https?:\/\//.test(url))

const receivingSchema = z.object({
  amount: z.string().optional(),
  chainId: z.number().int().nonnegative().optional(),
  txHash: z.string().optional(),
  txLink: httpUrlSchema.optional(),
  token: z
    .object({
      address: z.string().optional(),
      chainId: z.number().int().nonnegative().optional(),
      symbol: z.string().optional(),
      decimals: z.number().int().nonnegative().optional(),
    })
    .optional(),
})

const statusSchema = z.object({
  status: z.enum(['NOT_FOUND', 'INVALID', 'PENDING', 'DONE', 'FAILED']),
  substatus: z.string().optional(),
  substatusMessage: z.string().optional(),
  toAddress: z.string().optional(),
  receiving: receivingSchema.optional(),
  lifiExplorerLink: httpUrlSchema.optional(),
})

export interface LifiPerpsDepositStatus {
  state:
    | 'pending'
    | 'completed'
    | 'partial'
    | 'refunded'
    | 'failed'
    | 'unverified'
  receiving?: z.infer<typeof receivingSchema>
  lifiExplorerLink?: string
  substatusMessage?: string
}

interface DepositExpectation {
  recipient?: EvmAddress
  minimumAmount?: string
}

export interface UseLifiPerpsDepositStatusParams extends DepositExpectation {
  txHash?: EvmTxHash
  fromChainId: AnyTokenAnyChainDepositChainId
  bridge?: string
  enabled?: boolean
}

function isPositiveInteger(value: string | undefined): value is string {
  return Boolean(value && /^\d{1,78}$/.test(value) && BigInt(value) > 0n)
}

export function classifyLifiPerpsDepositStatus(
  value: unknown,
  { recipient, minimumAmount }: DepositExpectation,
): LifiPerpsDepositStatus {
  const parsed = statusSchema.safeParse(value)
  if (!parsed.success) return { state: 'unverified' }

  const { status, substatus, receiving, lifiExplorerLink, substatusMessage } =
    parsed.data
  const details = { receiving, lifiExplorerLink, substatusMessage }

  if (status === 'NOT_FOUND' || status === 'PENDING') {
    return { state: 'pending', ...details }
  }
  if ((status === 'DONE' || status === 'FAILED') && substatus === 'REFUNDED') {
    return { state: 'refunded', ...details }
  }
  if (status === 'FAILED') return { state: 'failed', ...details }
  if (status === 'DONE' && substatus === 'PARTIAL') {
    return { state: 'partial', ...details }
  }

  const verified =
    status === 'DONE' &&
    substatus === 'COMPLETED' &&
    recipient !== undefined &&
    parsed.data.toAddress?.toLowerCase() === recipient.toLowerCase() &&
    receiving?.chainId === LIFI_PERPS_CHAIN_ID &&
    receiving.token?.chainId === LIFI_PERPS_CHAIN_ID &&
    receiving.token.address?.toLowerCase() ===
      LIFI_PERPS_USDC_ADDRESS.toLowerCase() &&
    receiving.token.decimals === LIFI_PERPS_USDC_DECIMALS &&
    isPositiveInteger(receiving.amount) &&
    isPositiveInteger(minimumAmount) &&
    BigInt(receiving.amount) >= BigInt(minimumAmount)

  return { state: verified ? 'completed' : 'unverified', ...details }
}

export function useLifiPerpsDepositStatus({
  txHash,
  fromChainId,
  bridge,
  recipient,
  minimumAmount,
  enabled = true,
}: UseLifiPerpsDepositStatusParams): UseQueryResult<
  LifiPerpsDepositStatus,
  Error
> {
  return useQuery({
    queryKey: [
      'useLifiPerpsDepositStatus',
      txHash,
      fromChainId,
      bridge,
      recipient,
      minimumAmount,
    ],
    queryFn: async ({ signal }): Promise<LifiPerpsDepositStatus> => {
      if (!txHash) throw new Error('Deposit transaction hash is required.')

      const url = new URL('https://li.quest/v1/status')
      url.searchParams.set('txHash', txHash)
      url.searchParams.set('fromChain', fromChainId.toString())
      url.searchParams.set('toChain', LIFI_PERPS_CHAIN_ID.toString())
      if (bridge) url.searchParams.set('bridge', bridge)

      const response = await fetch(url, { signal })
      const value: unknown = await response.json()
      if (!response.ok) {
        const notIndexed = z.object({ code: z.literal(1003) }).safeParse(value)
        if (response.status === 404 && notIndexed.success) {
          return { state: 'pending' }
        }
        throw new Error(
          `Unable to fetch deposit status (HTTP ${response.status}).`,
        )
      }
      return classifyLifiPerpsDepositStatus(value, { recipient, minimumAmount })
    },
    enabled: enabled && Boolean(txHash),
    refetchInterval: (query) => {
      const state = query.state.data?.state
      return !state || state === 'pending' || state === 'unverified'
        ? 10_000
        : false
    },
    refetchIntervalInBackground: true,
    staleTime: 10_000,
  })
}
