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
  return fetch(`${EVM_APP_BASE_URL}/api/price/v2/${chainId}`).then((res) =>
    res.json(),
  )
}
