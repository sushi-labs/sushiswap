import type { ImageProps } from 'next/image'
import type { FC } from 'react'
import { ChainId, type Currency, getChainById } from 'sushi'

import type { EvmAddress } from 'sushi/evm'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'
import { LinkExternal } from '../link'

const AvaxLogo = 'avax.svg'
const BnbLogo = 'bnb.svg'
const EthereumLogo = 'ethereum.svg'
const FtmLogo = 'ftm.svg'
const OneLogo = 'one.svg'
// const HtLogo = 'ht.svg'
const MaticLogo = 'matic.svg'
// const OktLogo = 'okt.svg'
const xDaiLogo = 'xdai.svg'
const CeloLogo = 'celo.svg'
// const PalmLogo = 'plam.svg'
const KavaLogo = 'kava.svg'
const MetisLogo = 'metis.svg'
const BobaLogo = 'boba.svg'
const BttcLogo = 'bttc.svg'
const ThundercoreLogo = 'thundercore.svg'
const CoreLogo = 'core.svg'
const IslmLogo = 'islm.svg'
const FilecoinLogo = 'filecoin.svg'
const ZetaLogo = 'zeta.svg'
const CroLogo = 'cronos.svg'
const BitcoinLogo = 'bitcoin.svg'
const MntLogo = 'mntl.svg'
const ApeLogo = 'ape.svg'
const SonicLogo = 'sonic.svg'
const HypeLogo = 'hyper.svg'
const BeraLogo = 'berachain.svg'
const PlasmaLogo = 'plasma.svg'
const MonadLogo = 'monad.svg'
const SolanaLogo = 'solana.svg'
const OkbLogo = 'okb.svg'

const LOGO: Record<number, string> = {
  [ChainId.ETHEREUM]: EthereumLogo,
  [ChainId.SEPOLIA]: EthereumLogo,
  [ChainId.FANTOM]: FtmLogo,
  // [ChainId.FANTOM_TESTNET]: FtmLogo,
  [ChainId.POLYGON]: MaticLogo,
  // [ChainId.POLYGON_TESTNET]: MaticLogo,
  [ChainId.GNOSIS]: xDaiLogo,
  [ChainId.BSC]: BnbLogo,
  // [ChainId.BSC_TESTNET]: BnbLogo,
  [ChainId.AVALANCHE]: AvaxLogo,
  // [ChainId.AVALANCHE_TESTNET]: AvaxLogo,
  // [ChainId.HECO]: HtLogo,
  // [ChainId.HECO_TESTNET]: HtLogo,
  [ChainId.HARMONY]: OneLogo,
  // [ChainId.HARMONY_TESTNET]: OneLogo,
  // [ChainId.OKEX]: OktLogo,
  // [ChainId.OKEX_TESTNET]: OktLogo,
  [ChainId.ARBITRUM]: EthereumLogo,
  // [ChainId.ARBITRUM_TESTNET]: EthereumLogo,
  [ChainId.CELO]: CeloLogo,
  // [ChainId.PALM]: PalmLogo,
  [ChainId.OPTIMISM]: EthereumLogo,
  [ChainId.KAVA]: KavaLogo,
  [ChainId.ARBITRUM_NOVA]: EthereumLogo,
  [ChainId.METIS]: MetisLogo,
  [ChainId.BOBA]: EthereumLogo,
  // [ChainId.BOBA_AVAX]: BobaLogo,
  [ChainId.BOBA_BNB]: BobaLogo,
  [ChainId.BTTC]: BttcLogo,
  [ChainId.POLYGON_ZKEVM]: EthereumLogo,
  [ChainId.THUNDERCORE]: ThundercoreLogo,
  [ChainId.CORE]: CoreLogo,
  [ChainId.HAQQ]: IslmLogo,
  [ChainId.ZKSYNC_ERA]: EthereumLogo,
  [ChainId.LINEA]: EthereumLogo,
  [ChainId.BASE]: EthereumLogo,
  [ChainId.SCROLL]: EthereumLogo,
  [ChainId.FILECOIN]: FilecoinLogo,
  [ChainId.ZETACHAIN]: ZetaLogo,
  [ChainId.CRONOS]: CroLogo,
  [ChainId.BLAST]: EthereumLogo,
  [ChainId.ROOTSTOCK]: BitcoinLogo,
  [ChainId.MANTLE]: MntLogo,
  [ChainId.MANTA]: EthereumLogo,
  [ChainId.MODE]: EthereumLogo,
  [ChainId.TAIKO]: EthereumLogo,
  [ChainId.ZKLINK]: EthereumLogo,
  [ChainId.APE]: ApeLogo,
  [ChainId.SONIC]: SonicLogo,
  [ChainId.HEMI]: EthereumLogo,
  [ChainId.KATANA]: EthereumLogo,
  [ChainId.HYPEREVM]: HypeLogo,
  [ChainId.BERACHAIN]: BeraLogo,
  [ChainId.PLASMA]: PlasmaLogo,
  [ChainId.MONAD]: MonadLogo,
  [ChainId.MEGAETH]: EthereumLogo,
  [ChainId.XLAYER]: OkbLogo,
  [ChainId.SOLANA]: SolanaLogo,
  [ChainId.ROBINHOOD]: EthereumLogo,
}
function hashAddressToColor(address: string): string {
  let hash = 5381

  for (let index = 0; index < address.length; index++) {
    hash = (hash << 5) + hash + address.charCodeAt(index)
  }

  const hue = (hash >>> 0) % 360
  return `hsl(${hue}, 65%, 45%)`
}

export interface IconProps extends Omit<ImageProps, 'src' | 'alt'> {
  currency: Currency
  disableLink?: boolean
}

export const Icon: FC<IconProps> = ({
  currency,
  disableLink = true,
  ...rest
}) => {
  const address = currency.wrap().address
  const src =
    currency.type === 'native'
      ? `native-currency/${LOGO[currency.chainId]}`
      : typeof currency.metadata?.icon === 'string'
        ? currency.metadata.icon
        : `tokens/${currency.chainId}/${address}.jpg`

  const avatar = (
    <Avatar style={{ width: rest.width, height: rest.height }}>
      <AvatarImage width={Number(rest.width) ?? 20} src={src} />
      <AvatarFallback
        style={{ backgroundColor: hashAddressToColor(address.toLowerCase()) }}
        className="font-bold text-white"
      >
        {currency.symbol.charAt(0).toUpperCase() || '?'}
      </AvatarFallback>
    </Avatar>
  )

  if (disableLink) {
    return avatar
  }

  return (
    <LinkExternal
      href={getChainById(currency.chainId).getTokenUrl(
        // Ugly cast but will work fine
        currency.wrap().address as EvmAddress,
      )}
    >
      {avatar}
    </LinkExternal>
  )
}
