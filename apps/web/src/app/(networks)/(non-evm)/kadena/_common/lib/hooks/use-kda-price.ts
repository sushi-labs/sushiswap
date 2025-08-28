import { useQuery } from '@tanstack/react-query'

type PirceDataResponse = {
  Symbol: 'KDA'
  Name: 'Kadena'
  Address: '0x0000000000000000000000000000000000000000'
  Blockchain: 'Kadena'
  Price: number
  PriceYesterday: number
  VolumeYesterdayUSD: number
  Time: string
  Source: string
  Signature: string
}

export const getKdaPrice = async (): Promise<{
  priceUsd: number
  priceYesterdayUsd: number
  percentageChange: number
}> => {
  const res = await fetch(
    `https://api.diadata.org/v1/assetQuotation/Kadena/0x0000000000000000000000000000000000000000`,
  )
  const data = (await res.json()) as PirceDataResponse
  const percentageChange =
    ((data?.Price - data?.PriceYesterday) / data?.PriceYesterday) * 100
  return {
    priceUsd: data?.Price ?? 0,
    priceYesterdayUsd: data?.PriceYesterday ?? 0,
    percentageChange: Number.isNaN(percentageChange) ? 0 : percentageChange,
  }
}

export const useKdaPrice = () => {
  return useQuery({
    queryKey: ['kadena-kda-price'],
    queryFn: async () => {
      const data = await getKdaPrice()

      return data
    },
    staleTime: (60 * 1000) / 6,
    gcTime: 5 * 60 * 1000,
  })
}
