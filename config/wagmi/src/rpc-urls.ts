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
  [ChainId.BSC]: [`https://lb.drpc.org/ogrpc?network=bsc&dkey=${drpcId}`],
  [ChainId.CELO]: [`https://lb.drpc.org/ogrpc?network=celo&dkey=${drpcId}`],
  [ChainId.ETHEREUM]: [
    `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${drpcId}`,
  ],
  [ChainId.FANTOM]: [`https://lb.drpc.org/ogrpc?network=fantom&dkey=${drpcId}`],
  [ChainId.FILECOIN]: [
    `https://lb.drpc.org/ogrpc?network=filecoin&dkey=${drpcId}`,
  ],
  [ChainId.FUSE]: [`https://lb.drpc.org/ogrpc?network=fuse&dkey=${drpcId}`],
  [ChainId.GNOSIS]: [`https://lb.drpc.org/ogrpc?network=gnosis&dkey=${drpcId}`],
  [ChainId.HAQQ]: [`https://lb.drpc.org/ogrpc?network=haqq&dkey=${drpcId}`],
  [ChainId.HARMONY]: [
    `https://lb.drpc.org/ogrpc?network=harmony-0&dkey=${drpcId}`,
  ],
  [ChainId.KAVA]: [`https://lb.drpc.org/ogrpc?network=kava&dkey=${drpcId}`],
  [ChainId.LINEA]: [`https://lb.drpc.org/ogrpc?network=linea&dkey=${drpcId}`],
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
  [ChainId.SCROLL]: [`https://lb.drpc.org/ogrpc?network=scroll&dkey=${drpcId}`],
} as const

export type RpcEnabledChainId = keyof typeof rpcUrls
