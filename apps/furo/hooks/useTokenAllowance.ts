import { Amount, Token } from 'currency'
// import { useSingleCallResult } from 'app/state/multicall/hooks'
import { useMemo } from 'react'
import { erc20ABI, useContract, useToken } from 'wagmi'


export function useTokenAllowance(token?: Token, owner?: string, spender?: string): Amount<Token> | undefined {
  const contract = useContract({
    addressOrName: token?.address,
    contractInterface: erc20ABI,
  })

  // const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = contract.allowance(owner, spender)

  return useMemo(
    () => (token && allowance ? Amount.fromRawAmount(token, allowance.toString()) : undefined),
    [token, allowance],
  )
}
