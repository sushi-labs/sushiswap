import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { Currency } from '@sushiswap/currency'
import { WrappedTokenInfo } from '@sushiswap/token-lists'
import Image, { ImageProps } from 'next/image'
import { FC, useMemo, useState } from 'react'

import { Link } from '../link'

const BLOCKCHAIN: Record<number, string> = {
  [ChainId.ARBITRUM_NOVA]: 'arbitrum-nova',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.BOBA_AVAX]: 'boba-avax',
  [ChainId.BOBA]: 'boba',
  [ChainId.BSC]: 'bsc',
  [ChainId.CELO]: 'celo',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.AVALANCHE_TESTNET]: 'fuji',
  [ChainId.FUSE]: 'fuse',
  [ChainId.GNOSIS]: 'gnosis',
  [ChainId.HARMONY]: 'harmony',
  [ChainId.HECO]: 'heco',
  [ChainId.KAVA]: 'kava',
  [ChainId.METIS]: 'metis',
  [ChainId.MOONBEAM]: 'moonbeam',
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.OKEX]: 'okex',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.PALM]: 'palm',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.TELOS]: 'telos',
}

const AvaxLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/avax.svg'
const BnbLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/bnb.svg'
const EthereumLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/ethereum.svg'
const FtmLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/ftm.svg'
const OneLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/one.svg'
const HtLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/ht.svg'
const MaticLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/matic.svg'
const GlmrLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/glmr.svg'
const OktLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/okt.svg'
const xDaiLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/xdai.svg'
const CeloLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/celo.svg'
const PalmLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/plam.svg'
const MovrLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/movr.svg'
const FuseLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/fuse.svg'
const TelosLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/telos.svg'
const KavaLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/kava.svg'
const MetisLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/metis.svg'
const BobaLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/boba.svg'

const LOGO: Record<number, string> = {
  [ChainId.ETHEREUM]: EthereumLogo,
  [ChainId.KOVAN]: EthereumLogo,
  [ChainId.RINKEBY]: EthereumLogo,
  [ChainId.ROPSTEN]: EthereumLogo,
  [ChainId.GÖRLI]: EthereumLogo,
  [ChainId.FANTOM]: FtmLogo,
  [ChainId.FANTOM_TESTNET]: FtmLogo,
  [ChainId.POLYGON]: MaticLogo,
  [ChainId.POLYGON_TESTNET]: MaticLogo,
  [ChainId.GNOSIS]: xDaiLogo,
  [ChainId.BSC]: BnbLogo,
  [ChainId.BSC_TESTNET]: BnbLogo,
  [ChainId.AVALANCHE]: AvaxLogo,
  [ChainId.AVALANCHE_TESTNET]: AvaxLogo,
  [ChainId.HECO]: HtLogo,
  [ChainId.HECO_TESTNET]: HtLogo,
  [ChainId.HARMONY]: OneLogo,
  [ChainId.HARMONY_TESTNET]: OneLogo,
  [ChainId.OKEX]: OktLogo,
  [ChainId.OKEX_TESTNET]: OktLogo,
  [ChainId.ARBITRUM]: EthereumLogo,
  [ChainId.ARBITRUM_TESTNET]: EthereumLogo,
  [ChainId.CELO]: CeloLogo,
  [ChainId.PALM]: PalmLogo,
  [ChainId.MOONRIVER]: MovrLogo,
  [ChainId.FUSE]: FuseLogo,
  [ChainId.TELOS]: TelosLogo,
  [ChainId.MOONBEAM]: GlmrLogo,
  [ChainId.OPTIMISM]: EthereumLogo,
  [ChainId.KAVA]: KavaLogo,
  [ChainId.ARBITRUM_NOVA]: EthereumLogo,
  [ChainId.METIS]: MetisLogo,
  [ChainId.BOBA]: EthereumLogo,
  [ChainId.BOBA_AVAX]: BobaLogo,
}

export interface IconProps extends Omit<ImageProps, 'src'> {
  currency: Currency
  disableLink?: boolean
}

export const Icon: FC<IconProps> = ({ currency, disableLink, ...rest }) => {
  const [error, setError] = useState(false)

  const src = useMemo(() => {
    if (currency.isNative) {
      return LOGO[currency.chainId]
    }

    if (currency instanceof WrappedTokenInfo && currency.logoURI) {
      return currency.logoURI
    }

    // TODO: Currency logos should be accessed via proxy such as...
    // https://currency.sushi.com/{chainId}/{identifier}.jpg
    // e.g.
    // https://currency.sushi.com/1/eth.jpg - ETH
    // https://currency.sushi.com/1/0x...jpg - WETH
    return `https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/${
      BLOCKCHAIN[currency.chainId]
    }/${currency.wrapped.address}.jpg`
  }, [currency])

  if (error) {
    return (
      <svg width={rest.width} height={rest.height} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" rx="15" fill="url(#paint0_linear_13084_19043)" />
        <defs>
          <linearGradient
            id="paint0_linear_13084_19043"
            x1="-2.30769"
            y1="4.25715e-07"
            x2="35.0955"
            y2="9.13387"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0993EC" />
            <stop offset="1" stopColor="#F338C3" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if (!src) {
    return (
      <QuestionMarkCircleIcon
        width={rest.width}
        height={rest.height}
        className="rounded-full bg-white bg-opacity-[0.12]"
      />
    )
  }

  if (disableLink) {
    return <Image onError={() => setError(true)} src={src} alt={currency.name} className="rounded-full" {...rest} />
  }

  return (
    <Link.External className="flex" href={chains[currency.chainId].getTokenUrl(currency.wrapped.address)}>
      <Image onError={() => setError(true)} src={src} alt={currency.name} className="rounded-full" {...rest} />
    </Link.External>
  )
}
