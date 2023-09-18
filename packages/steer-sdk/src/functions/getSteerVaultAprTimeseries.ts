import { getChainIdAddressFromId } from '@sushiswap/format'
import { isPromiseFulfilled } from '@sushiswap/validate'
import { fetch } from '@whatwg-node/fetch'

interface GetSteerVaultsAprs {
  vaultIds: string[]
}

interface AprTimeseries {
  data: [
    {
      startTime: number
      endTime: number
      feeApr: number
    }
  ]
  message: string
}

function getAprTimeseries(chainId: number, address: string): Promise<AprTimeseries['data']> {
  const url = `https://ro81h8hq6b.execute-api.us-east-1.amazonaws.com/pool/apr/historical?address=${address}&chain=${chainId}`

  return fetch(url)
    .then((res) => res.json() as Promise<AprTimeseries>)
    .then((res) => res?.data)
}

async function getSteerVaultsAprTimeseries({ vaultIds }: GetSteerVaultsAprs) {
  const results = await Promise.allSettled(
    vaultIds.map(async (vaultId) => {
      const { address, chainId } = getChainIdAddressFromId(vaultId)

      return getAprTimeseries(chainId, address)
    })
  )

  return results.map((r) => (isPromiseFulfilled(r) ? r.value : null))
}

interface GetSteerVaultsApr {
  vaultId: string
}

async function getSteerVaultAprTimeseries({ vaultId }: GetSteerVaultsApr) {
  return (await getSteerVaultsAprTimeseries({ vaultIds: [vaultId] }))[0]
}

export { getSteerVaultAprTimeseries, getSteerVaultsAprTimeseries }
