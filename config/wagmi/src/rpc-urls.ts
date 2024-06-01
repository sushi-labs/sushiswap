import { ChainId } from 'sushi/chain'

const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']

export const rpcUrls = {
  [ChainId.ARBITRUM_NOVA]: [
    `https://lb.drpc.org/ogrpc?network=arbitrum-nova&dkey=${drpcId}`,
  ],
  [ChainId.ARBITRUM]: [
    `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${drpcId}`,
  ],
  [ChainId.AVALANCHE]: [
    `https://lb.drpc.org/ogrpc?network=avalanche&dkey=${drpcId}`,
  ],
  [ChainId.BASE]: [`https://lb.drpc.org/ogrpc?network=base&dkey=${drpcId}`],
  [ChainId.BOBA]: ['https://mainnet.boba.network'],
  [ChainId.BOBA_BNB]: ['https://bnb.boba.network'],
  [ChainId.BSC]: [`https://lb.drpc.org/ogrpc?network=bsc&dkey=${drpcId}`],
  [ChainId.BTTC]: ['https://rpc.bittorrentchain.io'],
  [ChainId.CELO]: [`https://lb.drpc.org/ogrpc?network=celo&dkey=${drpcId}`],
  [ChainId.ETHEREUM]: [
    `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${drpcId}`,
  ],
  [ChainId.FANTOM]: [`https://lb.drpc.org/ogrpc?network=fantom&dkey=${drpcId}`],
  [ChainId.FILECOIN]: [
    `https://lb.drpc.org/ogrpc?network=filecoin&dkey=${drpcId}`,
  ],
  // [ChainId.FILECOIN]: ['https://fil-mainnet-1.rpc.laconic.com/rpc/v1'],
  [ChainId.FUSE]: [`https://lb.drpc.org/ogrpc?network=fuse&dkey=${drpcId}`],
  [ChainId.GNOSIS]: [`https://lb.drpc.org/ogrpc?network=gnosis&dkey=${drpcId}`],
  [ChainId.HARMONY]: [
    `https://lb.drpc.org/ogrpc?network=harmony-0&dkey=${drpcId}`,
  ],
  [ChainId.KAVA]: [`https://lb.drpc.org/ogrpc?network=kava&dkey=${drpcId}`],
  [ChainId.METIS]: [`https://lb.drpc.org/ogrpc?network=metis&dkey=${drpcId}`],
  [ChainId.MOONBEAM]: [
    `https://lb.drpc.org/ogrpc?network=moonbeam&dkey=${drpcId}`,
  ],
  [ChainId.MOONRIVER]: [
    `https://lb.drpc.org/ogrpc?network=moonriver&dkey=${drpcId}`,
  ],
  [ChainId.OPTIMISM]: [
    `https://lb.drpc.org/ogrpc?network=optimism&dkey=${drpcId}`,
  ],
  [ChainId.POLYGON]: [
    `https://lb.drpc.org/ogrpc?network=polygon&dkey=${drpcId}`,
  ],
  [ChainId.POLYGON_ZKEVM]: [
    `https://lb.drpc.org/ogrpc?network=polygon-zkevm&dkey=${drpcId}`,
  ],
  [ChainId.THUNDERCORE]: ['https://mainnet-rpc.thundercore.com'],
  [ChainId.HAQQ]: [`https://lb.drpc.org/ogrpc?network=haqq&dkey=${drpcId}`],
  [ChainId.CORE]: ['https://rpc.coredao.org'],
  [ChainId.TELOS]: ['https://rpc1.us.telos.net/evm'],
  [ChainId.LINEA]: [`https://lb.drpc.org/ogrpc?network=linea&dkey=${drpcId}`],
  [ChainId.SCROLL]: [`https://lb.drpc.org/ogrpc?network=scroll&dkey=${drpcId}`],
  [ChainId.ZETACHAIN]: [
    'https://zetachain-mainnet-archive.allthatnode.com:8545',
  ],
  [ChainId.CRONOS]: [`https://lb.drpc.org/ogrpc?network=cronos&dkey=${drpcId}`],
  [ChainId.BLAST]: [`https://lb.drpc.org/ogrpc?network=blast&dkey=${drpcId}`],
  [ChainId.SKALE_EUROPA]: ['https://mainnet.skalenodes.com/v1/elated-tan-skat'],
  [ChainId.ROOTSTOCK]: ['https://public-node.rsk.co'],
} as const

export type RpcEnabledChainId = keyof typeof rpcUrls
