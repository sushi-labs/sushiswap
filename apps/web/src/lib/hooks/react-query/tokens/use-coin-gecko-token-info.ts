import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChainId, type Token } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import * as z from 'zod'

const COINGECKO_CHAIN_ID_BY_NAME = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.BSC]: 'bsc',
  [ChainId.POLYGON]: 'polygon_pos',
  [ChainId.AVALANCHE]: 'avax',
  [ChainId.CRONOS]: 'cro',
  [ChainId.HARMONY]: 'one',
  [ChainId.BOBA]: 'boba',
  [ChainId.FANTOM]: 'ftm',
  [ChainId.METIS]: 'metis',
  [ChainId.ARBITRUM]: 'arbitrum',
  // [ChainId.OKEX]: 'okexchain',
  [ChainId.CELO]: 'celo',
  [ChainId.GNOSIS]: 'xdai',
  // [ChainId.HECO]: 'heco',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.BTTC]: 'bttc',
  [ChainId.KAVA]: 'kava',
  [ChainId.THUNDERCORE]: 'thundercore',
  [ChainId.ARBITRUM_NOVA]: 'arbitrum_nova',
  [ChainId.CORE]: 'core',
  [ChainId.FILECOIN]: 'filecoin',
  [ChainId.ZKSYNC_ERA]: 'zksync',
  [ChainId.POLYGON_ZKEVM]: 'polygon-zkevm',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base',
  [ChainId.SCROLL]: 'scroll',
  [ChainId.ZETACHAIN]: 'zetachain',
  [ChainId.BLAST]: 'blast',
  [ChainId.BOBA_BNB]: 'boba-bnb',
  [ChainId.ROOTSTOCK]: 'rootstock',
  [ChainId.SKALE_EUROPA]: 'skale-europa',
  [ChainId.MANTLE]: 'mantle',
  [ChainId.MANTA]: 'manta-pacific',
  [ChainId.MODE]: 'mode',
  [ChainId.TAIKO]: 'taiko',
  [ChainId.ZKLINK]: 'zklink-nova',
  [ChainId.APE]: 'apechain',

  [ChainId.SOLANA]: 'solana',
  [StellarChainId.STELLAR]: 'stellar',
} as const

type CoinGeckoChainId = keyof typeof COINGECKO_CHAIN_ID_BY_NAME

const isCoinGeckoChainId = (chainId: ChainId): chainId is CoinGeckoChainId =>
  Object.keys(COINGECKO_CHAIN_ID_BY_NAME).includes(chainId.toString())

export function getCoinGeckoTokenInfoUrl(token?: Token) {
  if (!token || !isCoinGeckoChainId(token.chainId)) return undefined

  return `https://api.coingecko.com/api/v3/coins/${
    COINGECKO_CHAIN_ID_BY_NAME[token.chainId]
  }/contract/${encodeURIComponent(token.address)}`
}

const coinGeckoSchema = z.object({
  market_cap_rank: z.number().nullable(),
  market_data: z.object({
    current_price: z.object({
      usd: z.number(),
    }),
    total_volume: z.object({
      usd: z.number(),
    }),
    market_cap: z.object({
      usd: z.number(),
    }),
    ath: z.object({
      usd: z.number(),
    }),
    atl: z.object({
      usd: z.number(),
    }),
    circulating_supply: z.number(),
    total_supply: z.number().nullable(),
  }),
})

class CoinGeckoTokenInfoHttpError extends Error {
  constructor(
    readonly status: number,
    statusText: string,
  ) {
    super(`CoinGecko token info request failed: ${status} ${statusText}`)
  }
}

function shouldRetryCoinGeckoTokenInfoQuery(
  failureCount: number,
  error: Error,
) {
  if (error instanceof CoinGeckoTokenInfoHttpError && error.status === 404) {
    return false
  }

  return failureCount < 3
}

const fetchCoinGeckoTokenInfoQueryFn = async (token?: Token) => {
  const url = getCoinGeckoTokenInfoUrl(token)
  if (!url) throw new Error('Invalid token')

  const response = await fetch(url)

  if (response.status === 404) {
    throw new CoinGeckoTokenInfoHttpError(response.status, response.statusText)
  }

  const data = await response.json()

  const parsed = coinGeckoSchema.parse(data)

  return {
    price: parsed.market_data.current_price.usd,
    rank: parsed.market_cap_rank,
    volume24h: parsed.market_data.total_volume.usd,
    marketCap: parsed.market_data.market_cap.usd,
    ath: parsed.market_data.ath.usd,
    atl: parsed.market_data.atl.usd,
    circulatingSupply: parsed.market_data.circulating_supply,
    totalSupply: parsed.market_data.total_supply,
  }
}

export const useCoinGeckoTokenInfo = ({
  token,
  enabled = true,
}: {
  enabled?: boolean
  token?: Token
}) => {
  const url = getCoinGeckoTokenInfoUrl(token)

  return useQuery({
    queryKey: ['useCoinGeckoTokenInfo', token?.id],
    queryFn: () => fetchCoinGeckoTokenInfoQueryFn(token),
    enabled: Boolean(url && enabled),
    placeholderData: keepPreviousData,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
    retry: shouldRetryCoinGeckoTokenInfoQuery,
  })
}
