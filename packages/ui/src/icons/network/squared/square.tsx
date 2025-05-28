import type { IconComponent, NakedNetworkIconComponent } from '../../../types'
import { ApeNaked } from '../naked/ApeNaked'
import { AptosNaked } from '../naked/AptosNaked'
import { ArbitrumNaked } from '../naked/ArbitrumNaked'
import { ArbitrumNovaNaked } from '../naked/ArbitrumNovaNaked'
import { AvalancheNaked } from '../naked/AvalancheNaked'
import { BaseNaked } from '../naked/BaseNaked'
import { BinanceNaked } from '../naked/BinanceNaked'
import { BlastNaked } from '../naked/BlastNaked'
import { BobaAvaxNaked } from '../naked/BobaAvaxNaked'
import { BobaBNBNaked } from '../naked/BobaBNBNaked'
import { BobaNaked } from '../naked/BobaNaked'
import { BttcNaked } from '../naked/BttcNaked'
import { CeloNaked } from '../naked/CeloNaked'
import { CoreNaked } from '../naked/CoreNaked'
import { CronosNaked } from '../naked/CronosNaked'
import { EthereumNaked } from '../naked/EthereumNaked'
import { FantomNaked } from '../naked/FantomNaked'
import { FilecoinNaked } from '../naked/FilecoinNaked'
import { FuseNaked } from '../naked/FuseNaked'
import { GnosisNaked } from '../naked/GnosisNaked'
import { HaqqNaked } from '../naked/HaqqNaked'
import { HarmonyNaked } from '../naked/HarmonyNaked'
import { HecoNaked } from '../naked/HecoNaked'
import { HemiNaked } from '../naked/HemiNaked'
import { KavaNaked } from '../naked/KavaNaked'
import { LineaNaked } from '../naked/LineaNaked'
import { MantaNaked } from '../naked/MantaNaked'
import { MantleNaked } from '../naked/MantleNaked'
import { MetisNaked } from '../naked/MetisNaked'
import { ModeNaked } from '../naked/ModeNaked'
import { MoonbeamNaked } from '../naked/MoonbeamNaked'
import { MoonriverNaked } from '../naked/MoonriverNaked'
import { OkexNaked } from '../naked/OkexNaked'
import { OptimismNaked } from '../naked/OptimismNaked'
import { PalmNaked } from '../naked/PalmNaked'
import { PolygonNaked } from '../naked/PolygonNaked'
import { PolygonZKNaked } from '../naked/PolygonZKNaked'
import { RootstockNaked } from '../naked/RootstockNaked'
import { ScrollNaked } from '../naked/ScrollNaked'
import { SkaleNaked } from '../naked/SkaleNaked'
import { SonicNaked } from '../naked/SonicNaked'
import { TaikoNaked } from '../naked/TaikoNaked'
import { TelosNaked } from '../naked/TelosNaked'
import { ThunderCoreNaked } from '../naked/ThunderCoreNaked'
import { TronNaked } from '../naked/TronNaked'
import { ZKLinkNaked } from '../naked/ZKLinkNaked'
import { ZKSyncNaked } from '../naked/ZKSyncNaked'
import { ZetaChainNaked } from '../naked/ZetaChainNaked'

const makeSquare =
  (
    Naked: NakedNetworkIconComponent,
    bg: string,
    fill?: string,
  ): IconComponent =>
  ({ className, ...rest }) => (
    <Naked
      {...rest}
      className={className}
      circle={<rect width={128} height={128} fill={bg} />}
      fill={fill}
    />
  )

export const ApeSquare = makeSquare(ApeNaked, '#FFB200')
export const AptosSquare = makeSquare(AptosNaked, '#14444D')
export const ArbitrumSquare = makeSquare(ArbitrumNaked, '#28A0EF')
export const ArbitrumNovaSquare = makeSquare(ArbitrumNovaNaked, '#FC7622')
export const AvalancheSquare = makeSquare(AvalancheNaked, '#E84142')
export const BaseSquare = makeSquare(BaseNaked, '#0052FF')
export const BinanceSquare = makeSquare(BinanceNaked, '#F0B90B', '#FFFFFF')
export const BlastSquare = makeSquare(BlastNaked, '#F9D600')
export const BobaAvaxSquare = makeSquare(BobaAvaxNaked, '#CED8E6')
export const BobaBNBSquare = makeSquare(BobaBNBNaked, '#8DC1AA')
export const BobaSquare = makeSquare(BobaNaked, '#B5E3C0')
export const BttcSquare = makeSquare(BttcNaked, '#D92D21')
export const CeloSquare = makeSquare(CeloNaked, '#FBCC5C')
export const CoreSquare = makeSquare(CoreNaked, '#FF521B')
export const CronosSquare = makeSquare(CronosNaked, '#002D74')
export const EthereumSquare = makeSquare(EthereumNaked, '#627EEA')
export const FantomSquare = makeSquare(FantomNaked, '#1969FF')
export const FilecoinSquare = makeSquare(FilecoinNaked, '#0090FF')
export const FuseSquare = makeSquare(FuseNaked, '#24C54E')
export const GnosisSquare = makeSquare(GnosisNaked, '#00B2B8')
export const HaqqSquare = makeSquare(HaqqNaked, '#16B158')
export const HarmonySquare = makeSquare(HarmonyNaked, '#00AEE9')
export const HecoSquare = makeSquare(HecoNaked, '#11753C')
export const HemiSquare = makeSquare(HemiNaked, '#F14C4C')
export const KavaSquare = makeSquare(KavaNaked, '#FF4154')
export const LineaSquare = makeSquare(LineaNaked, '#1E64F0')
export const MantaSquare = makeSquare(MantaNaked, '#00B5D1')
export const MantleSquare = makeSquare(MantleNaked, '#0BE34B')
export const MetisSquare = makeSquare(MetisNaked, '#10C4B5')
export const ModeSquare = makeSquare(ModeNaked, '#17161B')
export const MoonbeamSquare = makeSquare(MoonbeamNaked, '#E1007E')
export const MoonriverSquare = makeSquare(MoonriverNaked, '#FFBE0B')
export const OkexSquare = makeSquare(OkexNaked, '#1D2FE6')
export const OptimismSquare = makeSquare(OptimismNaked, '#FF0420')
export const PalmSquare = makeSquare(PalmNaked, '#009B5B')
export const PolygonSquare = makeSquare(PolygonNaked, '#8247E5', '#FFFFFF')
export const PolygonZKSquare = makeSquare(PolygonZKNaked, '#9A6AFF')
export const RootstockSquare = makeSquare(RootstockNaked, '#EAB300')
export const ScrollSquare = makeSquare(ScrollNaked, '#FBCC5C')
export const SkaleSquare = makeSquare(SkaleNaked, '#00C8FF')
export const SonicSquare = makeSquare(SonicNaked, '#0081FF')
export const TaikoSquare = makeSquare(TaikoNaked, '#9D4CF9')
export const TelosSquare = makeSquare(TelosNaked, '#4C34F6')
export const ThunderCoreSquare = makeSquare(ThunderCoreNaked, '#FFC70B')
export const TronSquare = makeSquare(TronNaked, '#E50914')
export const ZKLinkSquare = makeSquare(ZKLinkNaked, '#4856FF')
export const ZKSyncSquare = makeSquare(ZKSyncNaked, '#8C8CFF')
export const ZetaChainSquare = makeSquare(ZetaChainNaked, '#2D74FF')
