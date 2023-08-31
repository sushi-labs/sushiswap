'use client'

import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Address, erc20ABI, useContractRead } from 'wagmi'

interface UseTokenAllowance {
  token?: Token
  chainId: ChainId | undefined
  owner: Address | undefined
  spender: Address | undefined
  enabled?: boolean
}

export const useTokenAllowance = ({ chainId, token, owner, spender, enabled = true }: UseTokenAllowance) => {
  return useContractRead({
    chainId,
    address: token ? (token.address as Address) : undefined,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [owner as Address, spender as Address],
    watch: true,
    enabled: Boolean(token && owner && spender && enabled && chainId),
    select: (data) => {
      if (token) {
        return Amount.fromRawAmount(token, data.toString())
      }
    },
  })
}
