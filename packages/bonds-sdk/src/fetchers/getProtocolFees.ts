import { getChainIdAddressFromId } from 'sushi'
import type { PublicClient } from 'viem'
import { bondFixedTermTellerAbi } from '../abi'

export function getProtocolFeesContracts({
  tellerIds,
}: { tellerIds: string[] }) {
  return tellerIds.map((tellerId) => {
    const { chainId, address } = getChainIdAddressFromId(tellerId)

    return {
      abi: bondFixedTermTellerAbi,
      chainId,
      address: address,
      functionName: 'protocolFee' as const,
    }
  })
}

interface GetProtocolFees {
  client: PublicClient
  tellerIds: string[]
}

export async function getProtocolFees({ client, tellerIds }: GetProtocolFees) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: getProtocolFeesContracts({ tellerIds }),
  })

  return result.flatMap((r, i) =>
    r.result
      ? {
          tellerId: tellerIds[i]!,
          protocolFee: r.result,
        }
      : [],
  )
}

interface GetProtocolFee {
  client: PublicClient
  tellerId: string
}

export async function getProtocolFee({ client, tellerId }: GetProtocolFee) {
  return (await getProtocolFees({ client, tellerIds: [tellerId] }))[0]
}
