import { BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Amount, Token } from 'sushi/currency'
import { FuroChainId } from '@sushiswap/furo-sdk'
import {
  Address,
  getBentoBoxContractConfig,
  getFuroStreamContractConfig,
  readContracts,
} from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'

interface UseStreamBalances {
  streams: { chainId: FuroChainId; streamId: string; token: Token }[]
}

export const useStreamBalances = ({ streams }: UseStreamBalances) => {
  return useQuery({
    queryKey: ['useStreamBalances', { streams }],
    queryFn: async () => {
      const [balances, totals] = await Promise.all([
        readContracts({
          contracts: streams.map(
            (stream) =>
              ({
                ...getFuroStreamContractConfig(stream.chainId),
                functionName: 'streamBalanceOf',
                chainId: stream.chainId,
                args: [BigInt(stream.streamId)],
              }) as const,
          ),
          allowFailure: false,
        }),
        readContracts({
          contracts: streams.map(
            (stream) =>
              ({
                ...getBentoBoxContractConfig(stream.chainId as BentoBoxChainId),
                functionName: 'totals',
                chainId: stream.chainId,
                args: [stream.token.address as Address],
              }) as const,
          ),
          allowFailure: false,
        }),
      ])

      return streams.reduce<Record<string, Amount<Token>>>(
        (acc, stream, index) => {
          const balance = balances[index]
          const elastic = totals[index][0]
          const base = totals[index][1]

          acc[stream.streamId] = Amount.fromShare(stream.token, balance[1], {
            base,
            elastic,
          })

          console.log(acc)

          return acc
        },
        {},
      )
    },
  })
}
