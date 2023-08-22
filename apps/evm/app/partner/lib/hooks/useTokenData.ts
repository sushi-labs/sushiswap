'use client'

import { ChainId } from '@sushiswap/chain'
import useSWR from 'swr'
import { isAddress } from 'viem'

import { Token } from '..'

export function useTokenData(address: string, chainId: ChainId) {
  return useSWR<Token>(address && chainId && isAddress(address) ? ['tokenData', address, chainId] : null, () =>
    fetch(`/partner/api/token?&address=${address}&chainId=${chainId.toString()}`).then((data) => data.json())
  )
}
