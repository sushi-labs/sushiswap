import fetch from 'isomorphic-unfetch'

export interface PriceAPI {
  [key: string]: number
}

export const fetchPricesByChainId = async (chainId): Promise<PriceAPI> =>
  fetch(`https://token-price.sushi.com/v0/${chainId}`).then((data) => data.json())
