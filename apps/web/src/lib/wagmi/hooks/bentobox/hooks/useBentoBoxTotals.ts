'use client'

import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'
import { isBentoBoxChainId } from 'sushi/config'
import { Type } from 'sushi/currency'
import { useConfig } from 'wagmi'
import { PublicWagmiConfig } from '../../../config/public'
import { getBentoboxTotals } from '../actions/getBentoboxTotals'

interface UseBentoboxTotalsParams {
  chainId: ChainId
  currencies: (Type | undefined)[]
  enabled?: boolean
  config: PublicWagmiConfig
}

const queryFn = async ({
  chainId,
  currencies,
  config,
}: UseBentoboxTotalsParams) => {
  if (isBentoBoxChainId(chainId)) {
    return getBentoboxTotals(chainId, currencies, config)
  }
  return undefined
}

export const useBentoBoxTotals = ({
  enabled = true,
  ...variables
}: Omit<UseBentoboxTotalsParams, 'config'>) => {
  const { currencies, chainId } = variables
  const config = useConfig()

  return useQuery({
    queryKey: ['useBentoboxTotals', { chainId, currencies }],
    enabled,
    queryFn: async () => {
      const data = await queryFn({ ...variables, config })
      if (!data) return null
      return data
    },
    refetchInterval: 10000,
  })
}
