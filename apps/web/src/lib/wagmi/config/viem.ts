import { getRpcHeaders, getRpcUrl } from 'src/lib/rpc'
import { EvmChainId, evmChains } from 'sushi/evm'
import { http, type Chain, type Transport } from 'viem'

function drpc(network: string): ReturnType<typeof http> {
  return http(getRpcUrl(network), {
    fetchOptions: { headers: getRpcHeaders() },
  })
}

export const publicTransports = {
  [EvmChainId.ARBITRUM_NOVA]: drpc('arbitrum-nova'),
  [EvmChainId.ARBITRUM]: drpc('arbitrum'),
  [EvmChainId.AVALANCHE]: drpc('avalanche'),
  [EvmChainId.BOBA]: drpc('boba-eth'),
  [EvmChainId.BOBA_BNB]: drpc('boba-bnb'),
  [EvmChainId.BSC]: drpc('bsc'),
  [EvmChainId.BTTC]: http('https://rpc.bittorrentchain.io'),
  [EvmChainId.CELO]: drpc('celo'),
  [EvmChainId.ETHEREUM]: drpc('ethereum'),
  [EvmChainId.FANTOM]: drpc('fantom'),
  [EvmChainId.GNOSIS]: drpc('gnosis'),
  [EvmChainId.HARMONY]: drpc('harmony-0'),
  [EvmChainId.KAVA]: drpc('kava'),
  [EvmChainId.METIS]: drpc('metis'),
  [EvmChainId.OPTIMISM]: drpc('optimism'),
  [EvmChainId.POLYGON]: drpc('polygon'),
  [EvmChainId.POLYGON_ZKEVM]: drpc('polygon-zkevm'),
  [EvmChainId.THUNDERCORE]: drpc('thundercore'),
  [EvmChainId.HAQQ]: drpc('haqq'),
  [EvmChainId.CORE]: drpc('core'),
  [EvmChainId.ZKSYNC_ERA]: drpc('zksync'),
  [EvmChainId.LINEA]: drpc('linea'),
  [EvmChainId.BASE]: drpc('base'),
  [EvmChainId.SCROLL]: drpc('scroll'),
  [EvmChainId.FILECOIN]: http('https://api.node.glif.io/rpc/v1'),
  [EvmChainId.ZETACHAIN]: drpc('zeta-chain'),
  [EvmChainId.CRONOS]: drpc('cronos'),
  [EvmChainId.BLAST]: drpc('blast'),
  [EvmChainId.SKALE_EUROPA]: http(
    'https://elated-tan-skat-indexer.skalenodes.com:10072',
  ),
  [EvmChainId.ROOTSTOCK]: drpc('rootstock'),
  [EvmChainId.MANTLE]: drpc('mantle'),
  [EvmChainId.MANTA]: drpc('manta-pacific'),
  [EvmChainId.MODE]: drpc('mode'),
  [EvmChainId.TAIKO]: drpc('taiko'),
  [EvmChainId.ZKLINK]: http('https://rpc.zklink.io'),
  [EvmChainId.APE]: drpc('apechain'),
  [EvmChainId.SONIC]: drpc('sonic'),
  [EvmChainId.HEMI]: drpc('hemi'),
  [EvmChainId.KATANA]: drpc('katana'),
  [EvmChainId.HYPEREVM]: drpc('hyperliquid'),
  [EvmChainId.BERACHAIN]: drpc('berachain'),
  [EvmChainId.PLASMA]: drpc('plasma'),
  [EvmChainId.FUSE]: drpc('fuse'),
  [EvmChainId.MONAD]: drpc('monad-mainnet'),
  [EvmChainId.MEGAETH]: drpc('megaeth'),
  [EvmChainId.XLAYER]: drpc('xlayer'),
  [EvmChainId.ROBINHOOD]: drpc('robinhood'),
  [EvmChainId.UNICHAIN]: drpc('unichain'),
  [EvmChainId.WORLDCHAIN]: drpc('worldchain'),
  /* Testnets */
  [EvmChainId.ARBITRUM_SEPOLIA]: http('https://sepolia-rollup.arbitrum.io/rpc'),
  // [EvmChainId.POLYGON_TESTNET]: http('https://rpc.ankr.com/polygon_mumbai'),
  [EvmChainId.SEPOLIA]: http('https://sepolia.drpc.live'),
  [EvmChainId.TATARA]: http('https://rpc.tatara.katanarpc.com'),
  [EvmChainId.BOKUTO]: http('https://rpc-bokuto.katanarpc.com'),
} as const satisfies Record<EvmChainId, Transport>

function mapTuple<const Items extends readonly unknown[], Result>(
  items: Items,
  mapper: (item: Items[number]) => Result,
): { [Index in keyof Items]: Result } {
  return items.map(mapper) as unknown as { [Index in keyof Items]: Result }
}

export function getPublicRpcUrl(chainId: EvmChainId): string {
  const rpcUrl = publicTransports[chainId]({ chain: undefined }).value?.url

  if (!rpcUrl) throw new Error(`Missing public RPC URL for chain ${chainId}`)
  return rpcUrl
}

export const publicChains = mapTuple(evmChains, ({ viemChain }) => {
  const rpcUrl = getPublicRpcUrl(viemChain.id)

  return {
    ...viemChain,
    rpcUrls: {
      ...viemChain.rpcUrls,
      // Privy's own browser clients also use the BotID-protected RPC proxy.
      privyWalletOverride: {
        http: [rpcUrl],
      },
    },
  }
}) satisfies Readonly<Chain[]>

export function fromEntriesConst<
  const Pairs extends readonly (readonly [PropertyKey, any])[],
>(
  pairs: Pairs,
): {
  readonly [K in Pairs[number] as K[0]]: Extract<
    Pairs[number],
    readonly [K[0], any]
  >[1]
} {
  return Object.fromEntries(pairs) as any
}

export const publicClientConfig = fromEntriesConst(
  publicChains.map(
    (chain) =>
      [
        chain.id,
        {
          chain,
          transport: publicTransports[chain.id],
        },
      ] as const,
  ),
)
