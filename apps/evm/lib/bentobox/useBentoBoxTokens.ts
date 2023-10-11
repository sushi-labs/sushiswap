'use client'

import { GetApiInputFromOutput, parseArgs } from '@sushiswap/client'
import { Amount, Token } from 'sushi/currency'
import { Rebase } from '@sushiswap/graph-client'
import { useAllPrices } from '@sushiswap/react-query'
import { useMemo } from 'react'
import useSWR from 'swr'

import { bentoBoxTokensSchema } from '../schema'

export type GetBentoBoxTokenArgs = GetApiInputFromOutput<
  typeof bentoBoxTokensSchema['_input'],
  typeof bentoBoxTokensSchema['_output']
>

export type BentoBoxToken = NonNullable<
  ReturnType<typeof useBentoBoxTokens>['data']
>[number]

export const getBentoBoxTokensUrl = (args: GetBentoBoxTokenArgs) =>
  `/analytics/api/bentobox${parseArgs(args)}`

function useBentoBoxTokens(args: GetBentoBoxTokenArgs) {
  const { data: rebases, isValidating } = useSWR<Rebase[]>(
    getBentoBoxTokensUrl(args),
    (url) => fetch(url).then((data) => data.json()),
  )

  const { data: prices, isLoading } = useAllPrices()

  return {
    data: useMemo(
      () =>
        prices &&
        rebases?.map((rebase) => {
          const token = new Token({
            chainId: rebase.chainId,
            decimals: rebase.token.decimals,
            address: rebase.id,
            symbol: rebase.token.symbol,
            name: rebase.token.name,
          })

          const liquidity = Amount.fromRawAmount(token, rebase.elastic)

          const price = prices?.[token.chainId]?.[token.address]

          return {
            id: token.id,
            token,
            liquidity: parseInt(liquidity.toSignificant(6)),
            liquidityUSD: price
              ? parseInt(
                  liquidity
                    .multiply(
                      prices?.[token.chainId]?.[token.address].asFraction,
                    )
                    .toSignificant(4),
                )
              : 0,
          }
        }),
      [rebases, prices],
    ),
    isLoading: isLoading || isValidating,
  }
}

export { useBentoBoxTokens }
