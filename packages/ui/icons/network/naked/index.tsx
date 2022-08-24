import { ChainId } from '@sushiswap/chain'
import React from 'react'

import { ArbitrumNaked } from './ArbitrumNaked'
import { ArbitrumNovaNaked } from './ArbitrumNovaNaked'
import { AvalancheNaked } from './AvalancheNaked'
import { BinanceNaked } from './BinanceNaked'
import { CeloNaked } from './CeloNaked'
import { EthereumNaked } from './EthereumNaked'
import { FantomNaked } from './FantomNaked'
import { FuseNaked } from './FuseNaked'
import { GnosisNaked } from './GnosisNaked'
import { HarmonyNaked } from './HarmonyNaked'
import { KavaNaked } from './KavaNaked'
import { MetisNaked } from './MetisNaked'
import { MoonbeamNaked } from './MoonbeamNaked'
import { MoonriverNaked } from './MoonriverNaked'
import { OptimismNaked } from './OptimismNaked'
import { PolygonNaked } from './PolygonNaked'
import { TelosNaked } from './TelosNaked'

export * from './ArbitrumNaked'
export * from './ArbitrumNovaNaked'
export * from './AvalancheNaked'
export * from './BinanceNaked'
export * from './CeloNaked'
export * from './EthereumNaked'
export * from './FantomNaked'
export * from './FuseNaked'
export * from './GnosisNaked'
export * from './HarmonyNaked'
export * from './KavaNaked'
export * from './MetisNaked'
export * from './MoonbeamNaked'
export * from './MoonriverNaked'
export * from './OptimismNaked'
export * from './PolygonNaked'
export * from './TelosNaked'

export const NETWORK_NAKED_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [ChainId.ETHEREUM]: EthereumNaked,
  [ChainId.FANTOM]: FantomNaked,
  [ChainId.POLYGON]: PolygonNaked,
  [ChainId.GNOSIS]: GnosisNaked,
  [ChainId.BSC]: BinanceNaked,
  [ChainId.ARBITRUM]: ArbitrumNaked,
  [ChainId.AVALANCHE]: AvalancheNaked,
  [ChainId.HARMONY]: HarmonyNaked,
  [ChainId.CELO]: CeloNaked,
  [ChainId.MOONRIVER]: MoonriverNaked,
  [ChainId.FUSE]: FuseNaked,
  [ChainId.TELOS]: TelosNaked,
  [ChainId.MOONBEAM]: MoonbeamNaked,
  [ChainId.OPTIMISM]: OptimismNaked,
  [ChainId.KAVA]: KavaNaked,
  [ChainId.METIS]: MetisNaked,
  [ChainId.ARBITRUM_NOVA]: ArbitrumNovaNaked,
}
