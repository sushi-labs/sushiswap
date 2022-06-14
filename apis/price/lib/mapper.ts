import { getPrices } from './graph'

export const prices = async (chainId: string) => {
  const data = await getPrices(chainId)
  const ethPrice = data.legacy_exchange_bundle?.ethPrice
  const block = data.legacy_exchange__meta?.block.number 
  const tokens = data.legacy_exchange_tokens
    .filter((token) => token.derivedETH != 0)
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

  return { tokens: tokens ? tokens : [], meta: { block } }
}
