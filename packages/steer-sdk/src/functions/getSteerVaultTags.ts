import { fetch } from '@whatwg-node/fetch'
import { isPromiseFulfilled } from 'sushi'

interface GetSteerVaultsTags {
  payloadHashes: string[]
}

async function getSteerVaultsTags({ payloadHashes }: GetSteerVaultsTags) {
  const results = await Promise.allSettled(
    payloadHashes.map(async (payloadHash) => {
      return fetch(
        `https://ro81h8hq6b.execute-api.us-east-1.amazonaws.com/getStrategyMetadata?hash=${payloadHash}`,
      ).then((res) => res.json() as Promise<{ tags: string[] }>)
    }),
  )

  return results.map((r) => (isPromiseFulfilled(r) ? r.value.tags : null))
}

interface GetSteerVaultTags {
  payloadHash: string
}

async function getSteerVaultTags({ payloadHash }: GetSteerVaultTags) {
  return (await getSteerVaultsTags({ payloadHashes: [payloadHash] }))[0]
}

export { getSteerVaultsTags, getSteerVaultTags }
