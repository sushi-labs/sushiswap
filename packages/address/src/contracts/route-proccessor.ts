import { ChainId } from '@sushiswap/chain'
// import routeProcessorExports from '@sushiswap/route-processor/exports'

// export function getRouteProcessorAddressForChainId(chainId: ChainId) {
//   if (!(chainId in routeProcessorExports)) {
//     throw new Error(`Unsupported route processor network for ${chainId}`)
//   }
//   return routeProcessorExports[chainId.toString() as keyof Omit<typeof routeProcessorExports, '31337'>][0].contracts
//     .RouteProcessor.address
// }

// // import routeProcessorExports from '@sushiswap/route-processor/exports.json'
// export type RouteProcessorExport = (typeof routeProcessorExports)[keyof typeof routeProcessorExports][number]
// export type RouteProcessorChainId = RouteProcessorExport['chainId']
// export type RouteProcessorContracts = RouteProcessorExport['contracts']

export const ROUTE_PROCESSOR_ADDRESS = {
  [ChainId.ETHEREUM]: '0x49C6FDCb3D5b2CecD8baff66c8e94b9B261ad925',
  [ChainId.POLYGON]: '0x4d838fAE6De55Ed70D4dAF981cFd647a27603f0e',
} as const
