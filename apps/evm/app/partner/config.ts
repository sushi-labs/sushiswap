import { ChainId } from 'sushi/chain'
import { getAddress } from 'viem'
import { z } from 'zod'

export const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.BASE,
  ChainId.CORE,
  ChainId.MOONRIVER,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.TELOS,
  ChainId.CELO,
  ChainId.FUSE,
  ChainId.OKEX,
  ChainId.HECO,
  ChainId.PALM,
  ChainId.KAVA,
  ChainId.METIS,
  ChainId.BOBA,
  ChainId.BOBA_AVAX,
  ChainId.ARBITRUM_NOVA,
  ChainId.THUNDERCORE,
  ChainId.OPTIMISM,
  ChainId.MOONBEAM,
  ChainId.BOBA_BNB,
  ChainId.BTTC,
  ChainId.POLYGON_ZKEVM,
  ChainId.LINEA,
  ChainId.FILECOIN
] as const

export type SupportedChainIds = typeof SUPPORTED_CHAINS
export type SupportedChainId = SupportedChainIds[number]

export enum ListType {
  DEFAULT = 'default-token-list',
  COMMUNITY = 'community-token-list',
}

export const SubmiTokenSchema = z.object({
  token: z.object({
    address: z.string().transform((tokenAddress) => getAddress(tokenAddress)),
    name: z.string(),
    symbol: z.string(),
    decimals: z.coerce.number(),
  }),
  tokenIcon: z.string(),
  chainId: z.coerce.number().transform((chainId) => chainId as ChainId),
  listType: z.enum([ListType.DEFAULT, ListType.COMMUNITY]),
})
