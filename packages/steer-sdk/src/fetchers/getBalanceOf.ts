import { erc20Abi } from 'sushi/abi'
import { getChainIdAddressFromId } from 'sushi/format'
import type { Address, PublicClient } from 'viem'

interface GetBalanceOfsContracts {
  account: Address
  vaultIds: string[]
}

export function getBalanceOfsContracts({
  account,
  vaultIds,
}: GetBalanceOfsContracts) {
  return vaultIds.map((id) => {
    const { chainId, address } = getChainIdAddressFromId(id)

    return {
      abi: erc20Abi,
      chainId,
      address,
      args: [account] as const,
      functionName: 'balanceOf' as const,
    }
  })
}

interface GetBalanceOfs extends GetBalanceOfsContracts {
  client: PublicClient
}

export async function getBalanceOfs({
  client,
  account,
  vaultIds,
}: GetBalanceOfs) {
  const result = await client.multicall({
    allowFailure: false,
    contracts: getBalanceOfsContracts({ account, vaultIds }),
  })

  return result.map((r, i) => ({
    vaultId: vaultIds[i]!,
    balanceOf: r,
  }))
}

interface GetBalanceOf {
  client: PublicClient
  account: Address
  vaultId: string
}

export async function getBalanceOf({ client, account, vaultId }: GetBalanceOf) {
  const result = await getBalanceOfs({ client, account, vaultIds: [vaultId] })
  return result[0]!.balanceOf
}
