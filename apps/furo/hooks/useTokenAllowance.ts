import { AddressZero } from '@ethersproject/constants'
import { Amount, Token } from 'currency'
// import { useSingleCallResult } from 'app/state/multicall/hooks'
import { useMemo } from 'react'
import { erc20ABI, useContractRead } from 'wagmi'


export function useTokenAllowance(token?: Token, owner?: string, spender?: string): Amount<Token> | undefined {
  const [{ data, error, loading }] = useContractRead(
    {
      addressOrName: token?.address ?? AddressZero,
      contractInterface: erc20ABI,
    },
    'allowance',
    { args: useMemo(() => [owner, spender], [owner, spender]), skip: !token },
  )
  
  console.log({data, error, loading})
  return data ? Amount.fromRawAmount(token, data.toString() ?? undefined) : undefined
}
