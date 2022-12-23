import { getBuiltGraphSDK } from '../.graphclient'

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

    if (newTokenPrices?.length < 1000) {
      rest = newRest
      break
    }

    lastId = newTokenPrices[newTokenPrices.length - 1].id
  }

  return { tokenPrices, ...rest }
}
