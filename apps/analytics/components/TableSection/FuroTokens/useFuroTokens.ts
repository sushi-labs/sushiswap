import { GetApiInputFromOutput, parseArgs } from '@sushiswap/client'
import { Amount, Token } from '@sushiswap/currency'
import { Furo_token } from '@sushiswap/graph-client'
import { FuroTokensSchema } from 'pages/api/furoTokens'
import { useMemo } from 'react'
import useSWR from 'swr'

import { useAllPrices } from '@sushiswap/react-query'
import { Fraction } from '@sushiswap/math'

export type GetFuroTokenArgs = GetApiInputFromOutput<
  (typeof FuroTokensSchema)['_input'],
  (typeof FuroTokensSchema)['_output']
>

export type FuroToken = NonNullable<ReturnType<typeof useFuroTokens>['data']>[number]

export const getFuroTokensUrl = (args: GetFuroTokenArgs) => `/analytics/api/furoTokens${parseArgs(args)}`

function useFuroTokens(args: GetFuroTokenArgs) {
  const { data: furoTokens, isValidating } = useSWR<Furo_token[]>(getFuroTokensUrl(args), (url) =>
    fetch(url).then((data) => data.json())
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

          let liquidityElastic = BigInt(0)

          if (BigInt(furoToken.rebase.base) !== BigInt(0)) {
            liquidityElastic =
              (BigInt(furoToken.liquidityShares) * BigInt(furoToken.rebase.elastic)) / BigInt(furoToken.rebase.base)
          }

          const priceUSD = Number(prices?.[furoToken.chainId]?.[token.address]?.toSignificant(4)) || 0
          const liquidity = Number(Amount.fromRawAmount(token, liquidityElastic).toSignificant(4))

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
      [furoTokens, prices]
    ),
    isLoading: isLoading || isValidating,
  }
}

export { useFuroTokens }
