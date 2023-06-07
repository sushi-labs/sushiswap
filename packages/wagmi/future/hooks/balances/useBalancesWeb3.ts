import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useQuery } from '@tanstack/react-query'
import { ChainId } from '@sushiswap/chain'
import { fetchBalance, Address, erc20ABI, readContracts } from '../../..'
import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'

interface UseBalanceParams {
  chainId: ChainId
  currencies: (Type | undefined)[]
  account: Address | undefined
  enabled?: boolean
}

export const queryFnUseBalances = async ({ chainId, currencies, account }: Omit<UseBalanceParams, 'enabled'>) => {
  if (!account) return null
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
    acc[validatedTokens[i].address] = Amount.fromRawAmount(validatedTokens[i], JSBI.BigInt(data[i]))
    return acc
  }, {})

  _data[AddressZero] = Amount.fromRawAmount(Native.onChain(chainId), JSBI.BigInt(native.value))

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
