import { useQuery } from '@tanstack/react-query'
import type { StellarToken } from 'sushi/stellar'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'

export const useLPUsdValue = ({
  token0,
  token1,
  reserve0,
  reserve1,
}: {
  token0: StellarToken
  token1: StellarToken
  reserve0: bigint
  reserve1: bigint
}) => {
  const { data: token0Price } = usePrice({
    chainId: token0.chainId,
    address: token0.address,
  })
  const { data: token1Price } = usePrice({
    chainId: token1.chainId,
    address: token1.address,
  })

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
    enabled: Boolean(token0Price !== undefined && token1Price !== undefined),
  })
}
