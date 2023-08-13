import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'

import { Address, erc20ABI, fetchBalance, readContracts } from '../../..'

interface UseBalanceParams {
  chainId: ChainId | undefined
  currencies: (Type | undefined)[]
  account: Address | undefined
  enabled?: boolean
}

export const queryFnUseBalances = async ({ chainId, currencies, account }: Omit<UseBalanceParams, 'enabled'>) => {
  if (!account || !chainId) return null
  const native = await fetchBalance({ address: account, chainId, formatUnits: 'wei' })
  const [validatedTokens, validatedTokenAddresses] = currencies.reduce<[Token[], Address[]]>(
    (acc, currencies) => {
      if (chainId && currencies && isAddress(currencies.wrapped.address)) {
        acc[0].push(currencies.wrapped)
        acc[1].push(currencies.wrapped.address as Address)
      }

      return acc
    },
    [[], []]
  )

  const data = await readContracts({
    contracts: validatedTokenAddresses.map(
      (token) =>
        ({
          chainId,
          address: token,
          abi: erc20ABI,
          functionName: 'balanceOf',
          args: [account],
        } as const)
    ),
  })

  const _data = data.reduce<Record<string, Amount<Type>>>((acc, cur, i) => {
    const amount = data[i].result
    if (typeof amount === 'bigint') {
      acc[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], amount)
    }
    return acc
  }, {})

  _data[AddressZero] = Amount.fromRawAmount(Native.onChain(chainId), native.value)

  return _data
}

export const useBalancesWeb3 = ({ chainId, currencies, account, enabled = true }: UseBalanceParams) => {
  return useQuery({
    queryKey: ['useBalances', { chainId, currencies, account }],
    queryFn: () => queryFnUseBalances({ chainId, currencies, account }),
    refetchInterval: 10000,
    enabled: Boolean(chainId && account && enabled),
  })
}
