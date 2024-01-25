import type { ChainId } from 'sushi/chain'
import { TOKEN_PRICE_API } from '../../constants'

export async function getTokenPricesChainV2({
  chainId,
}: {
  chainId: ChainId
}): Promise<Record<string, number>> {
  return fetch(`${TOKEN_PRICE_API}/v2/${chainId}`).then((res) => res.json())
}
