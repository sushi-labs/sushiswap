import { Token } from '@sushiswap/currency'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { useQuery } from '@tanstack/react-query'

import { getBuiltGraphSDK, Rebase, userVestingsQuery, vestingQuery } from '../../.graphclient'
import { SUPPORTED_CHAINS } from '../../config'
import { toToken } from '../mapper'
import { Vesting } from '../Vesting'
import { queryRebasesDTO } from './useRebasesDTO'

const GRAPH_HOST = 'api.thegraph.com'

interface UseUserVestings {
  account: string | undefined
}

export const useUserVestings = ({ account }: UseUserVestings) => {
  return useQuery({
    queryKey: ['useUserVestings', { account }],
    queryFn: async () => {
      if (!account) return null

      const sdks = SUPPORTED_CHAINS.map((chainId) =>
        getBuiltGraphSDK({
          chainId,
          host: GRAPH_HOST,
          name: FURO_SUBGRAPH_NAME[chainId],
        })
      )

      const data: { chainId: FuroChainId; data: userVestingsQuery }[] = []
      const results = await Promise.allSettled(sdks.map((sdk) => sdk.userVestings({ id: account.toLowerCase() })))
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          data.push({
            chainId: SUPPORTED_CHAINS[i] as FuroChainId,
            data: result.value,
          })
        }
      })

      const vestings: {
        vesting: userVestingsQuery['incomingVestings'][0] | userVestingsQuery['outgoingVestings'][0]
        chainId: FuroChainId
        vestingId: string
        token: Token
      }[] = []

      data.forEach((el) => {
        ;[...el.data.incomingVestings, ...el.data.outgoingVestings]
          .filter((el, i, vestings) => i === vestings.findIndex((vesting) => vesting.id === el.id))
          .forEach((vesting) => {
            const token = toToken(vesting.token, el.chainId)
            vestings.push({ vesting, chainId: el.chainId, vestingId: vesting.id, token })
          })
      })

      const rebases = await queryRebasesDTO({
        tokens: vestings.map((el) => el.token),
      })

      return vestings.map((el, i) => {
        if (rebases[i].data.rebase)
          return new Vesting({
            chainId: el.chainId,
            furo: el.vesting as NonNullable<vestingQuery['vesting']>,
            rebase: rebases[i].data.rebase as Pick<Rebase, 'id' | 'base' | 'elastic'>,
          })

        return undefined
      })
    },
  })
}
