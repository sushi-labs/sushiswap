import { isAddress } from 'viem'
import { zeroAddress } from 'viem'
import { ChainId } from 'sushi/chain'
import { Amount, Native, Token, Type } from 'sushi/currency'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { Address, erc20ABI, fetchBalance, readContracts } from '../../..'

interface UseBalanceParams {
  chainId: ChainId | undefined
  currencies: (Type | undefined)[]
  account: Address | undefined
  enabled?: boolean
}

export const queryFnUseBalances = async ({
  chainId,
  currencies,
  account,
}: Omit<UseBalanceParams, 'enabled'>) => {
  if (!account || !chainId || !currencies) return null
  const native = await fetchBalance({
    address: account,
    chainId,
    formatUnits: 'wei',
  })
  const [validatedTokens, validatedTokenAddresses] = currencies.reduce<
    [Token[], Address[]]
  >(
    (acc, currencies) => {
      if (chainId && currencies && isAddress(currencies.wrapped.address)) {
        acc[0].push(currencies.wrapped)
        acc[1].push(currencies.wrapped.address as Address)
      }

      return acc
    },
    [[], []],
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
        }) as const,
    ),
  })

  const _data = data.reduce<Record<string, Amount<Type>>>((acc, cur, i) => {
    const amount = data[i].result
    if (typeof amount === 'bigint') {
      acc[validatedTokens[i].address] = Amount.fromRawAmount(
        validatedTokens[i],
        amount,
      )
    }
    return acc
  }, {})

  _data[zeroAddress] = Amount.fromRawAmount(
    Native.onChain(chainId),
    native.value,
  )

  return _data
}

export const useBalancesWeb3 = ({
  chainId,
  currencies,
  account,
  enabled = true,
}: UseBalanceParams) => {
  useEffect(() => {
    if (currencies && currencies.length > 100) {
      throw new Error(
        'useBalancesWeb3: currencies length > 100, this will hurt performance and cause rate limits',
      )
    }
  }, [currencies])

  return useQuery({
    queryKey: ['useBalancesWeb3', { chainId, currencies, account }],
    queryFn: () => queryFnUseBalances({ chainId, currencies, account }),
    refetchInterval: 10000,
    enabled: Boolean(chainId && account && enabled && currencies),
  })
}
