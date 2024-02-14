'use client'

import { GetApiInputFromOutput, parseArgs } from '@sushiswap/client'
import { Furo_token } from '@sushiswap/graph-client'
import { useAllPrices } from '@sushiswap/react-query'
import { useMemo } from 'react'
import { Amount, Token } from 'sushi/currency'
import useSWR from 'swr'

import { furoTokensSchema } from '../schema'

export type GetFuroTokenArgs = GetApiInputFromOutput<
  typeof furoTokensSchema['_input'],
  typeof furoTokensSchema['_output']
>

export type FuroToken = NonNullable<
  ReturnType<typeof useFuroTokens>['data']
>[number]

export const getFuroTokensUrl = (args: GetFuroTokenArgs) =>
  `/analytics/api/furoTokens${parseArgs(args)}`

export function useFuroTokens(args: GetFuroTokenArgs) {
  const { data: furoTokens, isValidating } = useSWR<Furo_token[]>(
    getFuroTokensUrl(args),
    (url) => fetch(url).then((data) => data.json()),
  )

  const { data: prices, isLoading } = useAllPrices()

  return {
    data: useMemo(
      () =>
        prices &&
        furoTokens?.map((furoToken) => {
          const token = new Token({
            chainId: furoToken.chainId,
            decimals: furoToken.decimals,
            address: furoToken.id,
            symbol: furoToken.symbol,
            name: furoToken.name,
          })

          let liquidityElastic = 0n

          if (BigInt(furoToken.rebase.base) !== 0n) {
            liquidityElastic =
              (BigInt(furoToken.liquidityShares) *
                BigInt(furoToken.rebase.elastic)) /
              BigInt(furoToken.rebase.base)
          }

          const priceUSD =
            Number(
              prices?.[furoToken.chainId]?.[token.address]?.toSignificant(4),
            ) || 0
          const liquidity = Number(
            Amount.fromRawAmount(token, liquidityElastic).toSignificant(4),
          )

          return {
            id: token.id,
            token,
            priceUSD: priceUSD,
            liquidityBase: BigInt(furoToken.liquidityShares),
            liquidityElastic,
            liquidity,
            liquidityUSD: liquidity * priceUSD,
          }
        }),
      [furoTokens, prices],
    ),
    isLoading: isLoading || isValidating,
  }
}
