import { Amount, Token } from '@sushiswap/currency'
import { Address, getBentoBoxContractConfig, getFuroStreamContractConfig } from '@sushiswap/wagmi'
import { JSBI } from '@sushiswap/math'
import { useQuery } from '@tanstack/react-query'
import { FuroStreamChainId } from '@sushiswap/furo/exports/exports'
import { readContracts } from '@wagmi/core'
import { BigNumber } from 'ethers'

interface UseStreamBalances {
  chainId: FuroStreamChainId
  streams: { streamId: string; token: Token }[]
}

export const useStreamBalances = ({ chainId, streams }: UseStreamBalances) => {
  return useQuery({
    queryKey: ['useStreamBalances', { chainId, streams }],
    queryFn: async () => {
      const [balances, totals] = await Promise.all([
        readContracts({
          contracts: streams.map(
            (stream) =>
              ({
                ...getFuroStreamContractConfig(chainId),
                functionName: 'streamBalanceOf',
                chainId,
                args: [BigNumber.from(stream.streamId)],
              } as const)
          ),
        }),
        readContracts({
          contracts: streams.map(
            (stream) =>
              ({
                ...getBentoBoxContractConfig(chainId),
                functionName: 'totals',
                chainId,
                args: [stream.token.address as Address],
              } as const)
          ),
        }),
      ])

      return streams.reduce<Record<string, Amount<Token>>>((acc, stream, index) => {
        const balance = balances[index]
        const elastic = totals[index][0]
        const base = totals[index][1]

        acc[stream.streamId] = Amount.fromShare(stream.token, JSBI.BigInt(balance), {
          base: JSBI.BigInt(base),
          elastic: JSBI.BigInt(elastic),
        })

        return acc
      }, {})
    },
  })
}
