import { ChainId } from '@sushiswap/chain'
import React from 'react'

import { ArbitrumNaked } from './ArbitrumNaked'
import { ArbitrumNovaNaked } from './ArbitrumNovaNaked'
import { AvalancheNaked } from './AvalancheNaked'
import { BinanceNaked } from './BinanceNaked'
import { BobaNaked } from './BobaNaked'
import { BobaBNBNaked } from './BobaBNBNaked'
import { BobaAvaxNaked } from './BobaAvaxNaked'
import { BttcNaked } from './BttcNaked'
import { CeloNaked } from './CeloNaked'
import { EthereumNaked } from './EthereumNaked'
import { FantomNaked } from './FantomNaked'
import { FuseNaked } from './FuseNaked'
import { GnosisNaked } from './GnosisNaked'
import { HarmonyNaked } from './HarmonyNaked'
import { HecoNaked } from './HecoNaked'
import { KavaNaked } from './KavaNaked'
import { MetisNaked } from './MetisNaked'
import { MoonbeamNaked } from './MoonbeamNaked'
import { MoonriverNaked } from './MoonriverNaked'
import { OkexNaked } from './OkexNaked'
import { OptimismNaked } from './OptimismNaked'
import { PalmNaked } from './PalmNaked'
import { PolygonNaked } from './PolygonNaked'
import { TelosNaked } from './TelosNaked'
import { ThunderCoreNaked } from './ThunderCoreNaked'

export * from './ArbitrumNaked'
export * from './ArbitrumNovaNaked'
export * from './AvalancheNaked'
export * from './BinanceNaked'
export * from './BobaNaked'
export * from './BobaBNBNaked'
export * from './BobaAvaxNaked'
export * from './BttcNaked'
export * from './CeloNaked'
export * from './EthereumNaked'
export * from './FantomNaked'
export * from './FuseNaked'
export * from './GnosisNaked'
export * from './HarmonyNaked'
export * from './HecoNaked'
export * from './KavaNaked'
export * from './MetisNaked'
export * from './MoonbeamNaked'
export * from './MoonriverNaked'
export * from './OkexNaked'
export * from './OptimismNaked'
export * from './PalmNaked'
export * from './PolygonNaked'
export * from './TelosNaked'
export * from './ThunderCoreNaked'

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
  [ChainId.HECO]: HecoNaked,
  [ChainId.OKEX]: OkexNaked,
  [ChainId.PALM]: PalmNaked,
  [ChainId.BOBA]: BobaNaked,
  [ChainId.BOBA_AVAX]: BobaAvaxNaked,
  [ChainId.BOBA_BNB]: BobaBNBNaked,
  [ChainId.BTTC]: BttcNaked,
  [ChainId.THUNDERCORE]: ThunderCoreNaked,
}
