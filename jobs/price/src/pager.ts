import { getBuiltGraphSDK } from '../.graphclient/index.js'

export async function pager(host: string, name: string) {
  const sdk = getBuiltGraphSDK({ host, name })

  let lastId = ''
  let rest
  const tokenPrices = []

  for (;;) {
    const { tokenPrices: newTokenPrices, ...newRest } = await sdk.Tokens({
      first: 1000,
      where: { id_gt: lastId, derivedNative_gt: 0 },
    })

    tokenPrices.push(...newTokenPrices)

    if(!newTokenPrices) throw new Error(`Fetch on ${host}/${name} failed.`)

    if (newTokenPrices.length < 1000) {
      rest = newRest
      break
    }

    // eslint-disable-next-line
    lastId = newTokenPrices[newTokenPrices.length - 1]!.id
  }

  return { tokenPrices, ...rest }
}
