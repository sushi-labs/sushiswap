import { ChainId } from 'sushi/chain'

// const alchemyId =
//   process.env['ALCHEMY_ID'] || process.env['NEXT_PUBLIC_ALCHEMY_ID']
const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']

export const rpcUrls = {
  [ChainId.ARBITRUM_NOVA]: [
    `https://lb.drpc.org/ogrpc?network=arbitrum-nova&dkey=${drpcId}`,
  ],
  [ChainId.ARBITRUM]: [
    `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${drpcId}`,
    // `${arbitrum.rpcUrls.alchemy.http}/${alchemyId}`,
  ],
  [ChainId.AVALANCHE]: [
    `https://lb.drpc.org/ogrpc?network=avalanche&dkey=${drpcId}`,
  ],
  [ChainId.BASE]: [`https://lb.drpc.org/ogrpc?network=base&dkey=${drpcId}`],
  [ChainId.BSC]: [`https://lb.drpc.org/ogrpc?network=bsc&dkey=${drpcId}`],
  [ChainId.CELO]: [`https://lb.drpc.org/ogrpc?network=celo&dkey=${drpcId}`],
  [ChainId.ETHEREUM]: [
    `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${drpcId}`,
    // `${mainnet.rpcUrls.alchemy.http}/${alchemyId}`
  ],
  [ChainId.FANTOM]: [`https://lb.drpc.org/ogrpc?network=fantom&dkey=${drpcId}`],
  [ChainId.GNOSIS]: [`https://lb.drpc.org/ogrpc?network=gnosis&dkey=${drpcId}`],
  [ChainId.KAVA]: [`https://lb.drpc.org/ogrpc?network=kava&dkey=${drpcId}`],
  [ChainId.LINEA]: [`https://lb.drpc.org/ogrpc?network=linea&dkey=${drpcId}`],
  [ChainId.METIS]: [`https://lb.drpc.org/ogrpc?network=metis&dkey=${drpcId}`],
  [ChainId.MOONBEAM]: [
    `https://lb.drpc.org/ogrpc?network=moonbeam&dkey=${drpcId}`,
  ],
  [ChainId.OPTIMISM]: [
    `https://lb.drpc.org/ogrpc?network=optimism&dkey=${drpcId}`,
  ],

  [ChainId.POLYGON]: [
    `https://lb.drpc.org/ogrpc?network=polygon&dkey=${drpcId}`,
    // `${polygon.rpcUrls.alchemy.http}/${alchemyId}`
  ],
  [ChainId.POLYGON_ZKEVM]: [
    `https://lb.drpc.org/ogrpc?network=polygon-zkevm&dkey=${drpcId}`,
    // `https://polygonzkevm-mainnet.g.alchemy.com/v2/${alchemyId}`
  ],
} as const

export type RpcEnabledChainId = keyof typeof rpcUrls
