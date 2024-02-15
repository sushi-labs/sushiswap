import { getChainIdAddressFromId } from 'sushi'
import type { PublicClient } from 'viem'
import { bondFixedTermTellerAbi } from '../abi'

type Args = {
  referrerId: string
  tellerId: string
}

export function getReferrerFeesContracts({ args }: { args: Args[] }) {
  return args.map(({ referrerId, tellerId }) => {
    const { chainId, address: referrerAddress } =
      getChainIdAddressFromId(referrerId)
    const { address: tellerAddress } = getChainIdAddressFromId(tellerId)

    return {
      abi: bondFixedTermTellerAbi,
      chainId,
      address: tellerAddress,
      functionName: 'referrerFees' as const,
      args: [referrerAddress] as const,
    }
  })
}

interface GetReferrerFees {
  client: PublicClient
  args: Args[]
}

export async function getReferrerFees({ client, args }: GetReferrerFees) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: getReferrerFeesContracts({ args }),
  })

  return result.flatMap((r, i) =>
    r.result
      ? {
          referrerId: args[i]!.referrerId,
          tellerId: args[i]!.tellerId,
          referrerFee: r.result,
        }
      : [],
  )
}

interface GetReferrerFee {
  client: PublicClient
  arg: Args
}

export async function getReferrerFee({ client, arg }: GetReferrerFee) {
  return (await getReferrerFees({ client, args: [arg] }))[0]
}
