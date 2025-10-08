import { EvmChainId, evmChains } from 'sushi/evm'
import { http, type Chain, type Transport } from 'viem'

const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']

export const publicTransports = {
  [EvmChainId.ARBITRUM_NOVA]: http(
    `https://lb.drpc.org/ogrpc?network=arbitrum-nova&dkey=${drpcId}`,
  ),
  [EvmChainId.ARBITRUM]: http(
    `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${drpcId}`,
  ),
  [EvmChainId.AVALANCHE]: http(
    `https://lb.drpc.org/ogrpc?network=avalanche&dkey=${drpcId}`,
  ),
  [EvmChainId.BOBA]: http(
    `https://lb.drpc.org/ogrpc?network=boba-eth&dkey=${drpcId}`,
  ),
  [EvmChainId.BOBA_BNB]: http(
    `https://lb.drpc.org/ogrpc?network=boba-bnb&dkey=${drpcId}`,
  ),
  [EvmChainId.BSC]: http(
    `https://lb.drpc.org/ogrpc?network=bsc&dkey=${drpcId}`,
  ),
  [EvmChainId.BTTC]: http('https://rpc.bittorrentchain.io'),
  [EvmChainId.CELO]: http(
    `https://lb.drpc.org/ogrpc?network=celo&dkey=${drpcId}`,
  ),
  [EvmChainId.ETHEREUM]: http(
    `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${drpcId}`,
  ),
  [EvmChainId.FANTOM]: http(
    `https://lb.drpc.org/ogrpc?network=fantom&dkey=${drpcId}`,
  ),
  [EvmChainId.GNOSIS]: http(
    `https://lb.drpc.org/ogrpc?network=gnosis&dkey=${drpcId}`,
  ),
  [EvmChainId.HARMONY]: http(
    `https://lb.drpc.org/ogrpc?network=harmony-0&dkey=${drpcId}`,
  ),
  [EvmChainId.KAVA]: http(
    `https://lb.drpc.org/ogrpc?network=kava&dkey=${drpcId}`,
  ),
  [EvmChainId.METIS]: http(
    `https://lb.drpc.org/ogrpc?network=metis&dkey=${drpcId}`,
  ),
  [EvmChainId.OPTIMISM]: http(
    `https://lb.drpc.org/ogrpc?network=optimism&dkey=${drpcId}`,
  ),
  [EvmChainId.POLYGON]: http(
    `https://lb.drpc.org/ogrpc?network=polygon&dkey=${drpcId}`,
  ),
  [EvmChainId.POLYGON_ZKEVM]: http(
    `https://lb.drpc.org/ogrpc?network=polygon-zkevm&dkey=${drpcId}`,
  ),
  [EvmChainId.THUNDERCORE]: http(
    `https://lb.drpc.org/ogrpc?network=thundercore&dkey=${drpcId}`,
  ),
  [EvmChainId.HAQQ]: http(
    `https://lb.drpc.org/ogrpc?network=haqq&dkey=${drpcId}`,
  ),
  [EvmChainId.CORE]: http(
    `https://lb.drpc.org/ogrpc?network=core&dkey=${drpcId}`,
  ),
  [EvmChainId.ZKSYNC_ERA]: http(
    `https://lb.drpc.org/ogrpc?network=zksync&dkey=${drpcId}`,
  ),
  [EvmChainId.LINEA]: http(
    `https://lb.drpc.org/ogrpc?network=linea&dkey=${drpcId}`,
  ),
  [EvmChainId.BASE]: http(
    `https://lb.drpc.org/ogrpc?network=base&dkey=${drpcId}`,
  ),
  [EvmChainId.SCROLL]: http(
    `https://lb.drpc.org/ogrpc?network=scroll&dkey=${drpcId}`,
  ),
  [EvmChainId.FILECOIN]: http(
    'https://api.node.glif.io/rpc/v1',
    // `https://lb.drpc.org/ogrpc?network=filecoin&dkey=${drpcId}`,
  ),
  [EvmChainId.ZETACHAIN]: http(
    `https://lb.drpc.org/ogrpc?network=zeta-chain&dkey=${drpcId}`,
  ),
  [EvmChainId.CRONOS]: http(
    `https://lb.drpc.org/ogrpc?network=cronos&dkey=${drpcId}`,
  ),
  [EvmChainId.BLAST]: http(
    `https://lb.drpc.org/ogrpc?network=blast&dkey=${drpcId}`,
  ),
  [EvmChainId.SKALE_EUROPA]: http(
    'https://elated-tan-skat-indexer.skalenodes.com:10072',
  ),
  [EvmChainId.ROOTSTOCK]: http(
    `https://lb.drpc.org/ogrpc?network=rootstock&dkey=${drpcId}`,
  ),
  [EvmChainId.MANTLE]: http(
    `https://lb.drpc.org/ogrpc?network=mantle&dkey=${drpcId}`,
  ),
  [EvmChainId.MANTA]: http(
    `https://lb.drpc.org/ogrpc?network=manta-pacific&dkey=${drpcId}`,
  ),
  [EvmChainId.MODE]: http(
    `https://lb.drpc.org/ogrpc?network=mode&dkey=${drpcId}`,
  ),
  [EvmChainId.TAIKO]: http(
    `https://lb.drpc.org/ogrpc?network=taiko&dkey=${drpcId}`,
  ),
  [EvmChainId.ZKLINK]: http('https://rpc.zklink.io'),
  [EvmChainId.APE]: http(
    `https://lb.drpc.org/ogrpc?network=apechain&dkey=${drpcId}`,
  ),
  [EvmChainId.SONIC]: http(
    `https://lb.drpc.org/ogrpc?network=sonic&dkey=${drpcId}`,
  ),
  [EvmChainId.HEMI]: http(
    `https://lb.drpc.org/ogrpc?network=hemi&dkey=${drpcId}`,
  ),
  [EvmChainId.KATANA]: http('https://rpc.katana.network'),
  [EvmChainId.HYPEREVM]: http(
    `https://lb.drpc.org/ogrpc?network=hyperliquid&dkey=${drpcId}`,
  ),
  [EvmChainId.BERACHAIN]: http(
    `https://lb.drpc.org/ogrpc?network=berachain&dkey=${drpcId}`,
  ),
  [EvmChainId.PLASMA]: http(
    `https://lb.drpc.org/ogrpc?network=plasma&dkey=${drpcId}`,
  ),
  /* Testnets */
  [EvmChainId.ARBITRUM_SEPOLIA]: http('https://sepolia-rollup.arbitrum.io/rpc'),
  // [EvmChainId.POLYGON_TESTNET]: http('https://rpc.ankr.com/polygon_mumbai'),
  [EvmChainId.SEPOLIA]: http('https://sepolia.drpc.org'),
  [EvmChainId.TATARA]: http('https://rpc.tatara.katanarpc.com'),
} as const satisfies Record<EvmChainId, Transport>

function pluck<
  Arr extends readonly Record<string, any>[],
  K extends keyof Arr[number],
>(arr: Arr, key: K): { [I in keyof Arr]: Arr[I][K] } {
  // @ts-ignore
  return arr.map((item) => item[key]) as any
}

export const publicChains = pluck(evmChains, 'viemChain') satisfies Readonly<
  Chain[]
>

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
