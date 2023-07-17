'use client'

import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Chain, ChainId } from '@sushiswap/chain'
import { Currency } from '@sushiswap/currency'
import Image, { ImageProps } from 'next/image'
import { FC, useEffect, useMemo, useState } from 'react'

import { cloudinaryImageLoader } from '../../cloudinary'
import { classNames } from '../../index'

const AvaxLogo = 'avax.svg'
const BnbLogo = 'bnb.svg'
const EthereumLogo = 'ethereum.svg'
const FtmLogo = 'ftm.svg'
const OneLogo = 'one.svg'
const HtLogo = 'ht.svg'
const MaticLogo = 'matic.svg'
const GlmrLogo = 'glmr.svg'
const OktLogo = 'okt.svg'
const xDaiLogo = 'xdai.svg'
const CeloLogo = 'celo.svg'
const PalmLogo = 'plam.svg'
const MovrLogo = 'movr.svg'
const FuseLogo = 'fuse.svg'
const TelosLogo = 'telos.svg'
const KavaLogo = 'kava.svg'
const MetisLogo = 'metis.svg'
const BobaLogo = 'boba.svg'
const BttcLogo = 'bttc.svg'
const ThundercoreLogo = 'thundercore.svg'

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
  [ChainId.BOBA_BNB]: BobaLogo,
  [ChainId.BTTC]: BttcLogo,
  [ChainId.POLYGON_ZKEVM]: EthereumLogo,
  [ChainId.THUNDERCORE]: ThundercoreLogo,
}

function djb2(str: string) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i) /* hash * 33 + c */
  }
  return hash
}

function hashStringToColor(str: string) {
  const hash = djb2(str)
  const r = (hash & 0xff0000) >> 16
  const g = (hash & 0x00ff00) >> 8
  const b = hash & 0x0000ff
  return '#' + ('0' + r.toString(16)).substr(-2) + ('0' + g.toString(16)).substr(-2) + ('0' + b.toString(16)).substr(-2)
}

export interface IconProps extends Omit<ImageProps, 'src' | 'alt'> {
  currency: Currency
  disableLink?: boolean
}

export const Icon: FC<IconProps> = ({ currency, disableLink, className, ...rest }) => {
  const [error, setError] = useState(false)

  const src = useMemo(() => {
    if (!currency) return null
    if (currency.isNative) return `native-currency/${LOGO[currency.chainId]}`
    return `tokens/${currency.chainId}/${currency.wrapped.address}.jpg`
  }, [currency])

  useEffect(() => {
    setError(false)
  }, [src])

  if (error) {
    if (disableLink) {
      return (
        <div
          className="text-xs text-white font-bold rounded-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-gray-200 dark:from-blue-700 dark:to-blue-900"
          style={{
            width: rest.width,
            height: rest.height,
            background: hashStringToColor(`${currency.symbol} ${currency.name}` ?? '??'),
          }}
        >
          {+(rest.width || 0) < 20 ? currency.symbol?.substring(0, 1) : currency.symbol?.substring(0, 2) ?? '??'}
        </div>
      )
    }

    return (
      <a target="_blank" rel="noopener noreferrer" href={Chain.tokenUrl(currency.chainId, currency.wrapped.address)}>
        <div
          className="text-xs text-white font-bold rounded-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-gray-200 dark:from-blue-700 dark:to-blue-900"
          style={{
            width: rest.width,
            height: rest.height,
            background: hashStringToColor(`${currency.symbol} ${currency.name}` ?? '??'),
          }}
        >
          {currency.symbol?.substring(0, 2) ?? '??'}
        </div>
      </a>
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
    return (
      <Image
        key={src}
        onError={() => setError(true)}
        src={src}
        alt={currency.name || currency.symbol || currency.wrapped.address}
        className={classNames(className, 'rounded-full overflow-hidden')}
        width={rest.width}
        height={rest.height}
        loader={cloudinaryImageLoader}
        {...rest}
      />
    )
  }

  return (
    <a target="_blank" rel="noopener noreferrer" href={Chain.tokenUrl(currency.chainId, currency.wrapped.address)}>
      <Image
        key={src}
        onError={() => setError(true)}
        src={src}
        className={classNames(className, 'rounded-full overflow-hidden')}
        alt={currency.name || currency.symbol || currency.wrapped.address}
        width={rest.width}
        height={rest.height}
        loader={cloudinaryImageLoader}
        {...rest}
      />
    </a>
  )
}
