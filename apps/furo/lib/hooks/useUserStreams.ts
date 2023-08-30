import { Token } from '@sushiswap/currency'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { useQuery } from '@tanstack/react-query'

import { getBuiltGraphSDK, Rebase, streamQuery, userStreamsQuery } from '../../.graphclient'
import { SUPPORTED_CHAINS } from '../../config'
import { toToken } from '../mapper'
import { Stream } from '../Stream'
import { queryRebasesDTO } from './useRebasesDTO'

const GRAPH_HOST = 'api.thegraph.com'

interface UseUserStreams {
  account: string | undefined
}

export const useUserStreams = ({ account }: UseUserStreams) => {
  return useQuery({
    queryKey: ['useUserStreams', { account }],
    queryFn: async () => {
      if (!account) return null

      const sdks = SUPPORTED_CHAINS.map((chainId) =>
        getBuiltGraphSDK({
          chainId,
          host: GRAPH_HOST,
          name: FURO_SUBGRAPH_NAME[chainId],
        })
      )

      const data: { chainId: FuroChainId; data: userStreamsQuery }[] = []
      const results = await Promise.allSettled(sdks.map((sdk) => sdk.userStreams({ id: account.toLowerCase() })))
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          data.push({
            chainId: SUPPORTED_CHAINS[i] as FuroChainId,
            data: result.value,
          })
        }
      })

      const streams: {
        stream: userStreamsQuery['incomingStreams'][0] | userStreamsQuery['outgoingStreams'][0]
        chainId: FuroChainId
        streamId: string
        token: Token
      }[] = []

      data.forEach((el) => {
        ;[...el.data.incomingStreams, ...el.data.outgoingStreams]
          .filter((el, i, streams) => i === streams.findIndex((stream) => stream.id === el.id))
          .forEach((stream) => {
            const token = toToken(stream.token, el.chainId)
            streams.push({ stream, chainId: el.chainId, streamId: stream.id, token })
          })
      })

      const rebases = await queryRebasesDTO({
        tokens: streams.map((el) => el.token),
      })

      return streams.map((el, i) => {
        if (rebases[i].data.rebase)
          return new Stream({
            chainId: el.chainId,
            furo: el.stream as NonNullable<streamQuery['stream']>,
            rebase: rebases[i].data.rebase as Pick<Rebase, 'id' | 'base' | 'elastic'>,
          })

        return undefined
      })
    },
  })
}
