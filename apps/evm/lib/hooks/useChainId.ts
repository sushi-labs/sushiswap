'use client'

import { ChainId } from '@sushiswap/chain'
import { useNetwork } from '@sushiswap/wagmi'
import { useParams, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function useChainId() {
  const { chain } = useNetwork()
  const params = useParams()
  const searchParams = useSearchParams()
  return useMemo(() => {
    if (params?.chainId) return parseInt(params.chainId as string) as ChainId
    if (searchParams?.has('chainId')) return parseInt(searchParams.get('chainId') as string) as ChainId
    if (chain) return chain.id as ChainId
    return ChainId.ETHEREUM
  }, [chain, params, searchParams])
}
