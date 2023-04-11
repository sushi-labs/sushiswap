import { Amount, Token } from '@sushiswap/currency'
import { Address, erc20ABI, useContractRead } from 'wagmi'

interface UseTokenAllowance {
  token?: Token
  owner: Address | undefined
  spender: Address | undefined
  enabled?: boolean
}

export const useTokenAllowance = ({ token, owner, spender, enabled = true }: UseTokenAllowance) => {
  return useContractRead({
    address: token ? (token.address as Address) : undefined,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [owner as Address, spender as Address],
    watch: true,
    enabled: Boolean(token && owner && spender && enabled),
    select: (data) => {
      if (token) {
        return Amount.fromRawAmount(token, data.toString())
      }
    },
  })
}
