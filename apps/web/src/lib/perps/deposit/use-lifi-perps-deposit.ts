import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import type { Amount, Percent } from 'sushi'
import type { EvmAddress, EvmCurrency } from 'sushi/evm'
import { stringify } from 'viem'
import {
  type LifiPerpsPreparedStep,
  type LifiPerpsRoute,
  type LifiPerpsStep,
  lifiPerpsPreparedStepSchema,
  lifiPerpsRoutesResponseSchema,
} from './lifi-perps-schemas'

export function useLifiPerpsDepositRoutes({
  fromAmount,
  address,
  slippage,
  enabled = true,
}: {
  fromAmount?: Amount<EvmCurrency>
  address?: EvmAddress
  slippage: Percent
  enabled?: boolean
}): UseQueryResult<LifiPerpsRoute[], Error> {
  return useQuery({
    queryKey: ['perps/deposit/routes', fromAmount, address, slippage],
    queryKeyHashFn: stringify,
    queryFn: async ({ signal }): Promise<LifiPerpsRoute[]> => {
      if (!fromAmount || !address) throw new Error('Deposit details required.')
      const params = new URLSearchParams({
        destination: 'perps',
        fromChainId: String(fromAmount.currency.chainId),
        fromTokenAddress:
          fromAmount.currency.type === 'native'
            ? '0x0000000000000000000000000000000000000000'
            : fromAmount.currency.address,
        fromAmount: fromAmount.amount.toString(),
        fromAddress: address,
        slippage: String(Number(slippage.toString({ fixed: 2 })) / 100),
      })
      const response = await fetch(`/api/cross-chain/routes?${params}`, {
        signal,
      })
      if (!response.ok) throw new Error('Unable to load deposit routes.')
      return lifiPerpsRoutesResponseSchema.parse(await response.json()).routes
    },
    enabled: enabled && !!address && !!fromAmount?.gt(0n),
    refetchInterval: 20_000,
  })
}

export function useLifiPerpsDepositStep({
  step,
  enabled = true,
}: { step?: LifiPerpsStep; enabled?: boolean }): UseQueryResult<
  LifiPerpsPreparedStep,
  Error
> {
  return useQuery({
    queryKey: ['perps/deposit/step', step],
    queryKeyHashFn: stringify,
    queryFn: async ({ signal }): Promise<LifiPerpsPreparedStep> => {
      if (!step) throw new Error('Deposit route required.')
      const response = await fetch('/api/cross-chain/step?destination=perps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringify(step),
        signal,
      })
      if (!response.ok) throw new Error('Unable to prepare the deposit.')
      return lifiPerpsPreparedStepSchema.parse(await response.json())
    },
    enabled: enabled && !!step,
    refetchInterval: 10_000,
  })
}
