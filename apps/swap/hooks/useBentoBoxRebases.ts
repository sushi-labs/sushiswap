import { Type as Currency } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useSingleContractMultipleData } from 'lib/hooks/multicall'
import { useMemo } from 'react'

import { useBentoBoxContract } from './useBentoBoxContract'

type UseBentoBoxRebases = (
  chainId: number,
  tokens: (Currency | undefined)[]
) => {
  rebases: Record<string, { base: JSBI; elastic: JSBI } | undefined>
  loading: boolean
}

const useBentoBoxRebases: UseBentoBoxRebases = (chainId, tokens) => {
  const addresses = useMemo(() => tokens.map((token) => [token?.wrapped.address]), [tokens])
  const bentoboxContract = useBentoBoxContract(chainId)
  const results = useSingleContractMultipleData(bentoboxContract, 'totals', addresses)
  const loading: boolean = useMemo(() => results.some((callState) => callState.loading), [results])

  return useMemo(
    () => ({
      rebases: tokens.reduce<Record<string, { base: JSBI; elastic: JSBI } | undefined>>(
        (previousValue, currentValue, index) => {
          const el = results[index]
          if (currentValue) {
            if (el?.result) {
              previousValue[currentValue.wrapped.address] = {
                base: JSBI.BigInt(el.result.base.toString()),
                elastic: JSBI.BigInt(el.result.elastic.toString()),
              }
            } else {
              previousValue[currentValue.wrapped.address] = undefined
            }
          }
          return previousValue
        },
        {}
      ),
      loading,
    }),
    [loading, results, tokens]
  )
}

export const useBentoBoxRebase = (chainId: number, token: Currency | undefined) => {
  const tokens = useMemo(() => [token], [token])
  const { rebases, loading } = useBentoBoxRebases(chainId, tokens)
  return useMemo(() => {
    if (token && !loading) {
      return { rebase: rebases[token?.wrapped.address], loading }
    }

    return { rebase: undefined, loading }
  }, [loading, rebases, token])
}

export default useBentoBoxRebases
