import { ChainId } from 'sushi'

import type { IconComponent } from '../../../types'
import { ApeCircle } from './ape-circle'
import { AptosCircle } from './aptos-circle'
import { ArbitrumCircle } from './arbitrum-circle'
import { ArbitrumNovaCircle } from './arbitrum-nova-circle'
import { AvalancheCircle } from './avalanche-circle'
import { BaseCircle } from './base-circle'
import { BeraCircle } from './bera-circle'
import { BinanceCircle } from './binance-circle'
import { BlastCircle } from './blast-circle'
import { BobaBNBCircle } from './boba-bnb-circle'
import { BobaCircle } from './boba-circle'
import { BttcCircle } from './bttc-circle'
import { CeloCircle } from './celo-circle'
import { CoreCircle } from './core-circle'
import { CronosCircle } from './cronos-circle'
import { EthereumCircle } from './ethereum-circle'
import { FantomCircle } from './fantom-circle'
import { FilecoinCircle } from './filecoin-circle'
import { GnosisCircle } from './gnosis-circle'
import { HaqqCircle } from './haqq-circle'
import { HarmonyCircle } from './harmony-circle'
import { HemiCircle } from './hemi-circle'
import { HyperEVMCircle } from './hyper-evm-circle'
import { KatanaCircle } from './katana-circle'
import { KavaCircle } from './kava-circle'
import { LineaCircle } from './linea-circle'
import { MantaCircle } from './manta-circle'
import { MantleCircle } from './mantle-circle'
import { MegaETHCircle } from './mega-eth-circle'
import { MetisCircle } from './metis-circle'
import { ModeCircle } from './mode-circle'
import { MonadCircle } from './monad-circle'
import { OptimismCircle } from './optimism-circle'
import { PlasmaCircle } from './plasma-circle'
import { PolygonCircle } from './polygon-circle'
import { PolygonZKCircle } from './polygon-zk-circle'
import { RobinhoodCircle } from './robinhood-circle'
import { RootstockCircle } from './rootstock-circle'
import { ScrollCircle } from './scroll-circle'
import { SkaleCircle } from './skale-circle'
import { SolanaCircle } from './solana-circle'
import { SonicCircle } from './sonic-circle'
import { StellarCircle } from './stellar-circle'
import { TaikoCircle } from './taiko-circle'
import { ThunderCoreCircle } from './thunder-core-circle'
import { XLayerCircle } from './x-layer-circle'
import { ZetaChainCircle } from './zeta-chain-circle'
import { ZKLinkCircle } from './zk-link-circle'
import { ZKSyncCircle } from './zk-sync-circle'

export * from './ape-circle'
export * from './aptos-circle'
export * from './arbitrum-circle'
export * from './arbitrum-nova-circle'
export * from './avalanche-circle'
export * from './base-circle'
export * from './bera-circle'
export * from './blast-circle'
export * from './binance-circle'
export * from './boba-avax-circle'
export * from './boba-bnb-circle'
export * from './boba-circle'
export * from './bttc-circle'
export * from './celo-circle'
export * from './core-circle'
export * from './cronos-circle'
export * from './ethereum-circle'
export * from './fantom-circle'
export * from './filecoin-circle'
export * from './fuse-circle'
export * from './gnosis-circle'
export * from './haqq-circle'
export * from './harmony-circle'
export * from './heco-circle'
export * from './hemi-circle'
export * from './hyper-evm-circle'
export * from './katana-circle'
export * from './kava-circle'
export * from './linea-circle'
export * from './manta-circle'
export * from './mantle-circle'
export * from './mega-eth-circle'
export * from './metis-circle'
export * from './mode-circle'
export * from './monad-circle'
export * from './moonbeam-circle'
export * from './moonriver-circle'
export * from './okex-circle'
export * from './optimism-circle'
export * from './palm-circle'
export * from './plasma-circle'
export * from './polygon-circle'
export * from './polygon-zk-circle'
export * from './robinhood-circle'
export * from './rootstock-circle'
export * from './scroll-circle'
export * from './skale-circle'
export * from './solana-circle'
export * from './sonic-circle'
export * from './stellar-circle'
export * from './taiko-circle'
export * from './telos-circle'
export * from './thunder-core-circle'
export * from './x-layer-circle'
export * from './zk-link-circle'
export * from './zk-sync-circle'
export * from './zeta-chain-circle'

export const NETWORK_CIRCLE_ICON: Partial<
  Record<ChainId | string, IconComponent>
> = {
  [ChainId.ETHEREUM]: EthereumCircle,
  [ChainId.FANTOM]: FantomCircle,
  [ChainId.POLYGON]: PolygonCircle,
  [ChainId.GNOSIS]: GnosisCircle,
  [ChainId.BSC]: BinanceCircle,
  [ChainId.ARBITRUM]: ArbitrumCircle,
  [ChainId.AVALANCHE]: AvalancheCircle,
  [ChainId.HARMONY]: HarmonyCircle,
  [ChainId.CELO]: CeloCircle,
  [ChainId.OPTIMISM]: OptimismCircle,
  [ChainId.METIS]: MetisCircle,
  [ChainId.KAVA]: KavaCircle,
  [ChainId.ARBITRUM_NOVA]: ArbitrumNovaCircle,
  [ChainId.BOBA]: BobaCircle,
  [ChainId.BOBA_BNB]: BobaBNBCircle,
  [ChainId.BTTC]: BttcCircle,
  [ChainId.POLYGON_ZKEVM]: PolygonZKCircle,
  [ChainId.THUNDERCORE]: ThunderCoreCircle,
  [ChainId.HAQQ]: HaqqCircle,
  [ChainId.CORE]: CoreCircle,
  [ChainId.ZKSYNC_ERA]: ZKSyncCircle,
  [ChainId.LINEA]: LineaCircle,
  [ChainId.BASE]: BaseCircle,
  [ChainId.SCROLL]: ScrollCircle,
  [ChainId.FILECOIN]: FilecoinCircle,
  [ChainId.ZETACHAIN]: ZetaChainCircle,
  [ChainId.BLAST]: BlastCircle,
  [ChainId.SKALE_EUROPA]: SkaleCircle,
  [ChainId.ROOTSTOCK]: RootstockCircle,
  [ChainId.CRONOS]: CronosCircle,
  [ChainId.MANTLE]: MantleCircle,
  [ChainId.MANTA]: MantaCircle,
  [ChainId.MODE]: ModeCircle,
  [ChainId.TAIKO]: TaikoCircle,
  [ChainId.ZKLINK]: ZKLinkCircle,
  [ChainId.APE]: ApeCircle,
  [ChainId.SONIC]: SonicCircle,
  [ChainId.HEMI]: HemiCircle,
  [ChainId.KATANA]: KatanaCircle,
  [ChainId.HYPEREVM]: HyperEVMCircle,
  [ChainId.BERACHAIN]: BeraCircle,
  [ChainId.PLASMA]: PlasmaCircle,
  [ChainId.MONAD]: MonadCircle,
  [ChainId.MEGAETH]: MegaETHCircle,
  [ChainId.XLAYER]: XLayerCircle,
  [ChainId.APTOS]: AptosCircle,
  [ChainId.STELLAR]: StellarCircle,
  [ChainId.SOLANA]: SolanaCircle,
  [ChainId.ROBINHOOD]: RobinhoodCircle,
}
