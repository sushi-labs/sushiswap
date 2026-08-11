import { ChainId } from 'sushi'

import type { IconComponent } from '../../../types'
import { ApeNaked } from './ape-naked'
import { AptosNaked } from './aptos-naked'
import { ArbitrumNaked } from './arbitrum-naked'
import { ArbitrumNovaNaked } from './arbitrum-nova-naked'
import { AvalancheNaked } from './avalanche-naked'
import { BaseNaked } from './base-naked'
import { BeraNaked } from './bera-naked'
import { BinanceNaked } from './binance-naked'
import { BlastNaked } from './blast-naked'
import { BobaBNBNaked } from './boba-bnb-naked'
import { BobaNaked } from './boba-naked'
import { BttcNaked } from './bttc-naked'
import { CeloNaked } from './celo-naked'
import { CoreNaked } from './core-naked'
import { CronosNaked } from './cronos-naked'
import { EthereumNaked } from './ethereum-naked'
import { FantomNaked } from './fantom-naked'
import { FilecoinNaked } from './filecoin-naked'
import { GnosisNaked } from './gnosis-naked'
import { HaqqNaked } from './haqq-naked'
import { HarmonyNaked } from './harmony-naked'
import { HecoNaked } from './heco-naked'
import { HemiNaked } from './hemi-naked'
import { HyperEVMNaked } from './hyper-evm-naked'
import { KatanaNaked } from './katana-naked'
import { KavaNaked } from './kava-naked'
import { LineaNaked } from './linea-naked'
import { MantaNaked } from './manta-naked'
import { MantleNaked } from './mantle-naked'
import { MegaETHNaked } from './mega-eth-naked'
import { MetisNaked } from './metis-naked'
import { ModeNaked } from './mode-naked'
import { MonadNaked } from './monad-naked'
import { OptimismNaked } from './optimism-naked'
import { PlasmaNaked } from './plasma-naked'
import { PolygonNaked } from './polygon-naked'
import { PolygonZKNaked } from './polygon-zk-naked'
import { RobinhoodNaked } from './robinhood-naked'
import { RootstockNaked } from './rootstock-naked'
import { ScrollNaked } from './scroll-naked'
import { SkaleNaked } from './skale-naked'
import { SolanaNaked } from './solana-naked'
import { SonicNaked } from './sonic-naked'
import { StellarNaked } from './stellar-naked'
import { TaikoNaked } from './taiko-naked'
import { ThunderCoreNaked } from './thunder-core-naked'
import { XLayerNaked } from './x-layer-naked'
import { ZetaChainNaked } from './zeta-chain-naked'
import { ZKLinkNaked } from './zk-link-naked'
import { ZKSyncNaked } from './zk-sync-naked'

export * from './ape-naked'
export * from './aptos-naked'
export * from './arbitrum-naked'
export * from './arbitrum-nova-naked'
export * from './avalanche-naked'
export * from './base-naked'
export * from './bera-naked'
export * from './binance-naked'
export * from './blast-naked'
export * from './boba-avax-naked'
export * from './boba-bnb-naked'
export * from './boba-naked'
export * from './bttc-naked'
export * from './celo-naked'
export * from './core-naked'
export * from './cronos-naked'
export * from './ethereum-naked'
export * from './fantom-naked'
export * from './filecoin-naked'
export * from './fuse-naked'
export * from './gnosis-naked'
export * from './haqq-naked'
export * from './harmony-naked'
export * from './heco-naked'
export * from './hemi-naked'
export * from './hyper-evm-naked'
export * from './katana-naked'
export * from './kava-naked'
export * from './linea-naked'
export * from './manta-naked'
export * from './mantle-naked'
export * from './mega-eth-naked'
export * from './metis-naked'
export * from './mode-naked'
export * from './monad-naked'
export * from './moonbeam-naked'
export * from './moonriver-naked'
export * from './okex-naked'
export * from './optimism-naked'
export * from './palm-naked'
export * from './plasma-naked'
export * from './polygon-naked'
export * from './polygon-zk-naked'
export * from './robinhood-naked'
export * from './rootstock-naked'
export * from './scroll-naked'
export * from './skale-naked'
export * from './solana-naked'
export * from './sonic-naked'
export * from './stellar-naked'
export * from './taiko-naked'
export * from './telos-naked'
export * from './x-layer-naked'
export * from './zk-link-naked'
export * from './zk-sync-naked'
export * from './zeta-chain-naked'

export const NETWORK_NAKED_ICON: Partial<
  Record<ChainId | string, IconComponent>
> = {
  [ChainId.ETHEREUM]: EthereumNaked,
  [ChainId.FANTOM]: FantomNaked,
  [ChainId.POLYGON]: PolygonNaked,
  [ChainId.GNOSIS]: GnosisNaked,
  [ChainId.BSC]: BinanceNaked,
  [ChainId.ARBITRUM]: ArbitrumNaked,
  [ChainId.AVALANCHE]: AvalancheNaked,
  [ChainId.HARMONY]: HarmonyNaked,
  [ChainId.CELO]: CeloNaked,
  [ChainId.OPTIMISM]: OptimismNaked,
  [ChainId.KAVA]: KavaNaked,
  [ChainId.METIS]: MetisNaked,
  [ChainId.ARBITRUM_NOVA]: ArbitrumNovaNaked,
  [ChainId.BOBA]: BobaNaked,
  [ChainId.BOBA_BNB]: BobaBNBNaked,
  [ChainId.BTTC]: BttcNaked,
  [ChainId.POLYGON_ZKEVM]: PolygonZKNaked,
  [ChainId.THUNDERCORE]: ThunderCoreNaked,
  [ChainId.HAQQ]: HaqqNaked,
  [ChainId.CORE]: CoreNaked,
  [ChainId.ZKSYNC_ERA]: ZKSyncNaked,
  [ChainId.LINEA]: LineaNaked,
  [ChainId.BASE]: BaseNaked,
  [ChainId.SCROLL]: ScrollNaked,
  [ChainId.FILECOIN]: FilecoinNaked,
  [ChainId.ZETACHAIN]: ZetaChainNaked,
  [ChainId.BLAST]: BlastNaked,
  [ChainId.SKALE_EUROPA]: SkaleNaked,
  [ChainId.ROOTSTOCK]: RootstockNaked,
  [ChainId.CRONOS]: CronosNaked,
  [ChainId.MANTLE]: MantleNaked,
  [ChainId.MANTA]: MantaNaked,
  [ChainId.MODE]: ModeNaked,
  [ChainId.TAIKO]: TaikoNaked,
  [ChainId.ZKLINK]: ZKLinkNaked,
  [ChainId.APE]: ApeNaked,
  [ChainId.SONIC]: SonicNaked,
  [ChainId.HEMI]: HemiNaked,
  [ChainId.KATANA]: KatanaNaked,
  [ChainId.HYPEREVM]: HyperEVMNaked,
  [ChainId.BERACHAIN]: BeraNaked,
  [ChainId.PLASMA]: PlasmaNaked,
  [ChainId.MONAD]: MonadNaked,
  [ChainId.MEGAETH]: MegaETHNaked,
  [ChainId.XLAYER]: XLayerNaked,
  [ChainId.APTOS]: AptosNaked,
  [ChainId.STELLAR]: StellarNaked,
  [ChainId.SOLANA]: SolanaNaked,
  [ChainId.ROBINHOOD]: RobinhoodNaked,
}
