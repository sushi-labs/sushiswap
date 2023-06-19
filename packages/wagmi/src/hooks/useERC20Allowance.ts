import { Amount, Token } from '@sushiswap/currency'
import { useMemo } from 'react'
import { Address, erc20ABI, useContractRead } from 'wagmi'

interface UseERC20AllowanceReturn extends Omit<ReturnType<typeof useContractRead>, 'data'> {
  data: Amount<Token> | undefined
}

/**
 * @deprecated  use @sushiswap/wagmi/future/hooks/approvals/useTokenAllowance
 */
export function useERC20Allowance(
  watch: boolean,
  token?: Token,
  owner?: string,
  spender?: string
): UseERC20AllowanceReturn {
  const args = useMemo(() => [owner, spender] as [Address, Address], [owner, spender])
  const data = useContractRead({
    address: token ? (token.address as Address) : undefined,
    abi: erc20ABI,
    functionName: 'allowance',
    args,
    watch,
    enabled: !!token,
  })

  const amount = data?.data && token ? Amount.fromRawAmount(token, data.data.toString()) : undefined
  return useMemo(
    () => ({
      ...data,
      data: amount,
    }),
    [amount, data]
  )
}
