/**
 * Fetches the KDA token price from DiaData API
 * @param tokenAddress - The token address to fetch price for (defaults to KDA native token)
 * @returns Promise with price data or null if fetch fails
 */
export async function getKdaPrice(
  tokenAddress = '0x0000000000000000000000000000000000000000',
): Promise<{
  price: number
  priceYesterday: number
  volumeYesterdayUSD: number
  time: string
} | null> {
  try {
    const response = await fetch(
      `https://api.diadata.org/v1/assetQuotation/Kadena/${tokenAddress}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      },
    )

    if (!response.ok) {
      console.error(
        'Failed to fetch KDA price from DiaData:',
        response.statusText,
      )
      return null
    }

    const data = await response.json()

    return {
      price: data.Price,
      priceYesterday: data.PriceYesterday,
      volumeYesterdayUSD: data.VolumeYesterdayUSD,
      time: data.Time,
    }
  } catch (error) {
    console.error('Error fetching KDA price:', error)
    return null
  }
}
