import { useMemo } from 'react'
import { Amount } from 'sushi'
import { type EvmChainId, type EvmCurrency, nativeAddress } from 'sushi/evm'
import type { Address } from 'viem'
import { useBalances } from './use-balances'

type Args =
  | [EvmCurrency | undefined]
  | [EvmChainId | undefined, Address | undefined]
type Return = Omit<ReturnType<typeof useBalances>, 'data'> & {
  data: bigint | undefined
}

export function useBalance(currency: EvmCurrency | undefined): Return
export function useBalance(
  chainId: EvmChainId | undefined,
  tokenAddress: Address | undefined,
): Return

export function useBalance(arg1: Args[0], arg2?: Args[1]) {
  const [chainId, tokenAddresses] = useMemo(() => {
    if (!arg1) {
      return [undefined, []]
    }

    if (typeof arg1 === 'number') {
      return [arg1, arg2 ? [arg2] : []]
    }

    let address: Address
    if (arg1.type === 'native') {
      address = nativeAddress
    } else {
      address = arg1.address
    }

    return [arg1.chainId, [address]]
  }, [arg1, arg2])

  const result = useBalances(chainId, tokenAddresses)

  const tokenAddress = tokenAddresses[0]

  return useMemo(() => {
    return {
      ...result,
      data: tokenAddress ? result.data?.get(tokenAddress) : undefined,
    }
  }, [tokenAddress, result])
}

export function useAmountBalance(currency: EvmCurrency | undefined) {
  const result = useBalance(currency)

  return useMemo(() => {
    if (!currency || result.data === undefined) {
      return {
        ...result,
        data: undefined,
      }
    }

    const amount = new Amount(currency, result.data)

    return {
      ...result,
      data: amount,
    }
  }, [currency, result])
}
