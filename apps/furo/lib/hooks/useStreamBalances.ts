import { Amount, Token } from '@sushiswap/currency'
import { FuroStreamChainId } from '@sushiswap/furo/exports/exports'
import { Address, getBentoBoxContractConfig, getFuroStreamContractConfig, readContracts } from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'

interface UseStreamBalances {
  streams: { chainId: FuroStreamChainId; streamId: string; token: Token }[]
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
              } as const)
          ),
          allowFailure: false,
        }),
        readContracts({
          contracts: streams.map(
            (stream) =>
              ({
                ...getBentoBoxContractConfig(stream.chainId),
                functionName: 'totals',
                chainId: stream.chainId,
                args: [stream.token.address as Address],
              } as const)
          ),
          allowFailure: false,
        }),
      ])

      return streams.reduce<Record<string, Amount<Token>>>((acc, stream, index) => {
        const balance = balances[index]
        const elastic = totals[index][0]
        const base = totals[index][1]

        acc[stream.streamId] = Amount.fromShare(stream.token, balance[1], {
          base,
          elastic,
        })

        console.log(acc)

        return acc
      }, {})
    },
  })
}
