import { getChainIdAddressFromId } from '@sushiswap/format'
import { isPromiseFulfilled } from '@sushiswap/validate'
import { fetch } from '@whatwg-node/fetch'

interface GetSteerVaultsAprs {
  vaultIds: string[]
}

async function getSteerVaultsAprs({ vaultIds }: GetSteerVaultsAprs) {
  const results = await Promise.allSettled(
    vaultIds.map(async (vaultId) => {
      const { address, chainId } = getChainIdAddressFromId(vaultId)

      return fetch(
        `https://ro81h8hq6b.execute-api.us-east-1.amazonaws.com/pool/weekly-apr?address=${address}&chain=${chainId}`
      ).then((res) => res.json() as Promise<{ apr: number }>)
    })
  )

  return results.map((r) => (isPromiseFulfilled(r) ? r.value.apr / 100 : null))
}

interface GetSteerVaultsApr {
  vaultId: string
}

async function getSteerVaultApr({ vaultId }: GetSteerVaultsApr) {
  return (await getSteerVaultsAprs({ vaultIds: [vaultId] }))[0]
}

export { getSteerVaultApr, getSteerVaultsAprs }
