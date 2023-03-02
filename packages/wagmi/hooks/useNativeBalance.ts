import { useBalance } from 'wagmi'
import { Amount, Native } from '@sushiswap/currency'
import { useCallback, useMemo } from 'react'
import { ChainId } from '@sushiswap/chain'
import { FetchBalanceResult } from '@wagmi/core'

type Params = NonNullable<Parameters<typeof useBalance>[0]>

export const useNativeBalance = (args: Params) => {
  const select = useCallback(
    (data: FetchBalanceResult | undefined) => {
      if (!data) return
      return Amount.fromRawAmount(Native.onChain(args.chainId || ChainId.ETHEREUM), data.value.toString())
    },
    [args.chainId]
  )

  const result = useBalance(args)

  return useMemo(() => {
    return {
      ...result,
      data: select(result.data),
    }
  }, [result, select])
}
