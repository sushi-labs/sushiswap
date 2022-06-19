import { SUPPORTED_CHAINS } from './config'
import { getPrices } from './lib/graph'
import { pricesToJson } from './lib/mapper'
import redis from './lib/redis'

export async function execute() {
  const chainPrices: ReturnType<typeof getPrices>[] = []
  console.log('Updating prices for chains: '.concat(SUPPORTED_CHAINS.join(', ')))
  for (const chainId of SUPPORTED_CHAINS as unknown as string[]) {
    chainPrices.push(getPrices(chainId))
  }

  await (
    await Promise.all(chainPrices)
  ).forEach(async (result) => {
    const json = pricesToJson(result.chainId, result.data)
    await redis.hset('prices', result.chainId, JSON.stringify(json))
  })

  console.log(`Finished updating prices.`)
}
execute()
