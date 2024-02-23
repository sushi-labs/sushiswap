'use client'

import { useEffect } from 'react'
import { ChainId } from 'sushi/chain'
import { Amount, Token } from 'sushi/currency'
import { Address, erc20Abi } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'

interface UseTokenAllowance {
  token?: Token
  chainId: ChainId | undefined
  owner: Address | undefined
  spender: Address | undefined
  enabled?: boolean
}

export const useTokenAllowance = ({
  chainId,
  token,
  owner,
  spender,
  enabled = true,
}: UseTokenAllowance) => {
  const query = useReadContract({
    chainId,
    address: token ? (token.address as Address) : undefined,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner as Address, spender as Address],
    query: {
      enabled: Boolean(token && owner && spender && enabled && chainId),
      select: (data) => {
        if (token) {
          return Amount.fromRawAmount(token, data.toString())
        }
      },
    },
  })

  const { data: blockNumber } = useBlockNumber({ watch: true })

  useEffect(() => {
    if (blockNumber) {
      query.refetch()
    }
  }, [blockNumber, query.refetch])

  return query
}
