import { isPromiseFulfilled } from 'sushi'
import {
  EXTRACTOR_SUPPORTED_CHAIN_IDS,
  type ExtractorSupportedChainId,
} from 'sushi/evm'

export async function getAllPrices() {
  const results = await Promise.allSettled(
    EXTRACTOR_SUPPORTED_CHAIN_IDS.map((chainId) =>
      fetch(`https://api.sushi.com/price/v1/${chainId}`).then((res) =>
        res.json(),
      ),
    ),
  )
  return results.reduce(
    (previousValue, currentValue, i) => {
      previousValue[EXTRACTOR_SUPPORTED_CHAIN_IDS[i]] = isPromiseFulfilled(
        currentValue,
      )
        ? currentValue.value
        : {}
      return previousValue
    },
    {} as Record<ExtractorSupportedChainId, Record<string, number>>,
  )
}
