import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  type EvmToken,
} from 'sushi/evm'
import { type Address, erc20Abi, isAddress, zeroAddress } from 'viem'

import { getBalance, readContracts } from '@wagmi/core'
import { Amount } from 'sushi'
import { type Config, serialize, useBalance, useConfig } from 'wagmi'
import type { GetBalanceReturnType } from 'wagmi/actions'
import { useWatchByInterval } from '../watch/useWatchByInterval'

interface QueryBalanceParams {
  chainId: EvmChainId | undefined
  currencies: (EvmCurrency | undefined)[]
  account: Address | undefined
  nativeBalance?: GetBalanceReturnType
  config: Config
}

export const queryFnUseBalances = async ({
  chainId,
  currencies,
  account,
  nativeBalance,
  config,
}: QueryBalanceParams) => {
  if (!account || !chainId || !currencies) return null

  let native = nativeBalance
  if (typeof native === 'undefined') {
    native = await getBalance(config, {
      address: account,
      chainId,
    })
  }

  const [validatedTokens, validatedTokenAddresses] = currencies.reduce<
    [EvmToken[], Address[]]
  >(
    (acc, currencies) => {
      if (chainId && currencies && isAddress(currencies.wrap().address)) {
        acc[0].push(currencies.wrap())
        acc[1].push(currencies.wrap().address)
      }

      return acc
    },
    [[], []],
  )

  const data = await readContracts(config, {
    contracts: validatedTokenAddresses.map(
      (token) =>
        ({
          chainId,
          address: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account],
        }) as const,
    ),
  })

  const _data = data.reduce<Record<string, Amount<EvmCurrency>>>(
    (acc, _cur, i) => {
      const amount = data[i].result
      if (typeof amount === 'bigint') {
        acc[validatedTokens[i].address] = new Amount(validatedTokens[i], amount)
      }
      return acc
    },
    {},
  )

  _data[zeroAddress] = new Amount(EvmNative.fromChainId(chainId), native.value)

  return _data
}

interface UseBalanceParams {
  chainId: EvmChainId | undefined
  currencies: (EvmCurrency | undefined)[]
  account: Address | undefined
  enabled?: boolean
}

export const useBalancesWeb3 = ({
  chainId,
  currencies,
  account,
  enabled = true,
}: UseBalanceParams) => {
  const { data: nativeBalance, queryKey } = useBalance({
    chainId,
    address: account,
    query: { enabled },
  })

  const config = useConfig()

  useWatchByInterval({ key: queryKey, interval: 10000 })

  useEffect(() => {
    if (currencies && currencies.length > 100) {
      throw new Error(
        'useBalancesWeb3: currencies length > 100, this will hurt performance and cause rate limits',
      )
    }
  }, [currencies])

  return useQuery({
    queryKey: [
      'useBalancesWeb3',
      { chainId, currencies, account, nativeBalance: serialize(nativeBalance) },
    ],
    queryFn: () =>
      queryFnUseBalances({
        chainId,
        currencies,
        account,
        nativeBalance,
        config,
      }),
    refetchInterval: 10000,
    enabled: Boolean(chainId && account && enabled && currencies),
  })
}
