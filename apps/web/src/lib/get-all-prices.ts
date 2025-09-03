import { isPromiseFulfilled } from 'sushi'
import {
  SWAP_API_SUPPORTED_CHAIN_IDS,
  type SwapApiSupportedChainId,
} from 'sushi/evm'

export async function getAllPrices() {
  const results = await Promise.allSettled(
    SWAP_API_SUPPORTED_CHAIN_IDS.map((chainId) =>
      fetch(`https://api.sushi.com/price/v1/${chainId}`).then((res) =>
        res.json(),
      ),
    ),
  )
  return results.reduce(
    (previousValue, currentValue, i) => {
      previousValue[SWAP_API_SUPPORTED_CHAIN_IDS[i]] = isPromiseFulfilled(
        currentValue,
      )
        ? currentValue.value
        : {}
      return previousValue
    },
    {} as Record<SwapApiSupportedChainId, Record<string, number>>,
  )
}
