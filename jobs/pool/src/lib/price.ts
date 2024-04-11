import type { ChainId } from 'sushi/chain'

export async function getTokenPrices({
  chainId,
}: {
  chainId: ChainId
}): Promise<Record<string, number>> {
  return fetch(`https://api.sushi.com/price/v1/${chainId}`)
    .then((res) => res.json())
    .catch((e) => {
      console.error('Error fetching token prices', chainId, e)
      throw e
    })
}
