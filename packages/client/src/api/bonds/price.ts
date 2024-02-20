import type { ChainId } from 'sushi/chain'
import { EVM_APP_BASE_URL } from '../../constants'

export async function getTokenPricesChainV1({
  chainId,
}: {
  chainId: ChainId
}): Promise<Record<string, number>> {
  return fetch(`${EVM_APP_BASE_URL}/api/price/v1/${chainId}`).then((res) =>
    res.json(),
  )
}

export async function getTokenPricesChainV2({
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
