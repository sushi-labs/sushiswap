import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
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
        acc[1].push(currencies.wrapped.address)
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
    if (data[i]) {
      const amount = Amount.fromRawAmount(validatedTokens[i], data[i].toString())
      if (amount.greaterThan(ZERO)) {
        acc[validatedTokens[i].address] = amount
      }
    }

    return acc
  }, {})

  if (native.value) {
    _data[AddressZero] = Amount.fromRawAmount(Native.onChain(chainId), native.value.toString())
  }

  return _data
}

export const useBalancesWeb3 = ({ chainId, currencies, account, enabled = true }: UseBalanceParams) => {
  return useQuery({
    queryKey: ['useBalancesWeb3', { chainId, currencies, account }],
    queryFn: async () => {
      return await queryFnUseBalances({ chainId, currencies, account })
    },
    refetchInterval: 10000,
    enabled: Boolean(chainId && account && enabled),
  })
}
