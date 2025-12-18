import { useQuery } from '@tanstack/react-query'
import { useStablePrice } from '~stellar/_common/lib/hooks/price/use-stable-price'
import type { Token } from '~stellar/_common/lib/types/token.type'

export const useLPUsdValue = ({
  token0,
  token1,
  reserve0,
  reserve1,
}: {
  token0: Token
  token1: Token
  reserve0: bigint
  reserve1: bigint
}) => {
  const { data: token0Price } = useStablePrice({ token: token0 })
  const { data: token1Price } = useStablePrice({ token: token1 })
  return useQuery({
    queryKey: [
      'stellar',
      'useLPUsdValue',
      token0,
      token1,
      reserve0.toString(),
      reserve1.toString(),
      token0Price,
      token1Price,
    ],
    queryFn: async () => {
      const reserve0Usd =
        (Number(token0Price) ?? 0) * (Number(reserve0) / 10 ** token0.decimals)
      const reserve1Usd =
        (Number(token1Price) ?? 0) * (Number(reserve1) / 10 ** token1.decimals)
      const totalUSD = reserve0Usd + reserve1Usd
      return totalUSD ?? 0
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: true,
  })
}
