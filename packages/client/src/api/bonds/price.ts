import { TOKEN_PRICE_API } from 'src'
import type { ChainId } from 'sushi/chain'

export async function getTokenPricesChainV2({
  chainId,
}: {
  chainId: ChainId
}): Promise<Record<string, number>> {
  return fetch(`${TOKEN_PRICE_API}/api/v2/${chainId}`).then((res) => res.json())
}
