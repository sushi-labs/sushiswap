import { ChainId } from '@sushiswap/chain'

// import routeProcessorExports from '@sushiswap/route-processor/exports.json'
// export type RouteProcessorExport = typeof routeProcessorExports[keyof typeof routeProcessorExports][number]
// export type TridentExportChainId = RouteProcessorExport['chainId']
// export type TridentExportContracts = RouteProcessorExport['contracts']

export const ROUTE_PROCESSOR_ADDRESS = {
  [ChainId.ETHEREUM]: '0xf267704dD1393c26B39A6D41F49Bea233B34F722',
  [ChainId.POLYGON]: '0xf267704dD1393c26B39A6D41F49Bea233B34F722',
} as const
