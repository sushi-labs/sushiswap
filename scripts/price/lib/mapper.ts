import { TokenPricesQuery } from '../.graphclient'

export const pricesToJson = (chainId: string, data: TokenPricesQuery) => {
  const ethPrice = data.legacy_exchange_bundle?.ethPrice
  const updatedAtBlock = data.legacy_exchange__meta?.block.number
  const updatedAtTimestamp = Number((Date.now() / 1000).toFixed())

  const tokens = data.legacy_exchange_tokens
    ?.filter((token) => token.derivedETH != 0)
    .map((token) => {
      const price = Number(token.derivedETH) * Number(ethPrice)
      return {
        [token.id]: {
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          price,
        },
      }
    })

  return { tokens: tokens ? tokens : [], meta: { chainId, updatedAtBlock, updatedAtTimestamp } }
}
