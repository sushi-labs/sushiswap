import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Chain, ChainId } from '@sushiswap/chain'
import { Currency } from '@sushiswap/currency'
import Image, { ImageProps } from 'next/image'
import { FC, useEffect, useMemo, useState } from 'react'
import { cloudinaryImageLoader } from '../../../cloudinary'

import { ExternalLink } from '../ExternalLink'

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

export const Icon: FC<IconProps> = ({ currency, disableLink, ...rest }) => {
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
      <ExternalLink className="flex" href={Chain.tokenUrl(currency.chainId, currency.wrapped.address)}>
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
      </ExternalLink>
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
        className="rounded-full"
        width={rest.width}
        height={rest.height}
        loader={cloudinaryImageLoader}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADhUlEQVRIx6VXz48UVRD+qmb6DXhQNoYYsy6rrFGMUSCYrDvgwauJ2cOGMTHGmzcjuAZiSNCOgWhUMGjixT9AYCFkb8aDMSQLRpCbF91FZRFcLuuvDUq26/PQs83rntc9PdJJJ/XmVb/6ql59VTWCGs/u3WzIpp92NgWTrcTazrDZJTbkjHDGZZfwsktsLjLMPrjy/bnOTCfpd6ZUbU68vrh+aN3qnpZh2hk3uoRwRkSpQaytC/KNKMGRe2/9+Ulnpn1zYMPPHvylExmOOuNwzkCJwQCYxWiV0y/NbD0VOl97fiFlV7wYC+S4AsPKVEkBKAFhilZ8ubuX6ZJQckSFJ09PXXovjqnVHsfUp/Hr547sREm1h84sWwdD761bCU9c2Lb9xTgWC3q8Q68dFqAjBBRcQ57KIISEoPt6Hue8LUaDAIAXdn536Z1gqLcevtpR8M3MgBfGtYO0J6Sop5fuHzj73IWpnOEHji6uV8qHuQ8LH0vISKmeH5n0VVAUcuzi8xfvygxvuNnYK8SIIpA4JWD8QwsGKkBzmLeSV9PkOsnGEz9ev+7zNE0My+SonLM5uVKvu24Zl+bv/nlYt8z/tkvJjVpA7odUWfQ2H+4yvVAEQd73+PKmCRXhZI6LA3PWA3M7pJkTGSu6cpe/k9ok2mVGipmp/sHM08unXX/Q0lYQm8Nc7M3MzECNyJSDBpQcUyHvCad/Pc6WFpBSPULADdqXs+zH2aIR9la93LV0E1GIPyo5G+S2z9m8kZqgf1cFFsLpX56ZtQsNSiM4r2qcC6f/nXO2t3avRcXmVERn74yzRTA+Z72E9e5XKLM6uuX+cwLcqEr/XjD5+83X676gl0bPTnyjMx1J1HBEAvdb7Mfql9OanO0FLR8IxBQApLH6sQJX/PutxdkBuJ3q8mr0r32atcWv44f+AfiGEByIswgNByyremyAr42cTyfPbAL58tDoKRW8q31p4nO2tx9XgD708FftM8GZa3tr9KASJ3qKQrFdDsZZNCDHH3tmPO4zV1Nenr78dmR8yxnlfzX92zKbhvd3TDx1QLwJs3Kgf2XPwpQz+ygyjtQf6M3fu+IS2zv+xfiZegN99/ns2Njplb+ajwiwX4ElzXeXcD8moJAlBfatrvz9aJnRvv+dsjk/puLaD+1mYpOthG1HG3MJh7oeL0fGBWecW0fMfvvktvNxIayh5z//1nKmShHglAAAAABJRU5ErkJggg=="
        {...rest}
      />
    )
  }

  return (
    <ExternalLink className="flex" href={Chain.tokenUrl(currency.chainId, currency.wrapped.address)}>
      <Image
        key={src}
        onError={() => setError(true)}
        src={src}
        alt={currency.name || currency.symbol || currency.wrapped.address}
        className="rounded-full"
        width={rest.width}
        height={rest.height}
        loader={cloudinaryImageLoader}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADhUlEQVRIx6VXz48UVRD+qmb6DXhQNoYYsy6rrFGMUSCYrDvgwauJ2cOGMTHGmzcjuAZiSNCOgWhUMGjixT9AYCFkb8aDMSQLRpCbF91FZRFcLuuvDUq26/PQs83rntc9PdJJJ/XmVb/6ql59VTWCGs/u3WzIpp92NgWTrcTazrDZJTbkjHDGZZfwsktsLjLMPrjy/bnOTCfpd6ZUbU68vrh+aN3qnpZh2hk3uoRwRkSpQaytC/KNKMGRe2/9+Ulnpn1zYMPPHvylExmOOuNwzkCJwQCYxWiV0y/NbD0VOl97fiFlV7wYC+S4AsPKVEkBKAFhilZ8ubuX6ZJQckSFJ09PXXovjqnVHsfUp/Hr547sREm1h84sWwdD761bCU9c2Lb9xTgWC3q8Q68dFqAjBBRcQ57KIISEoPt6Hue8LUaDAIAXdn536Z1gqLcevtpR8M3MgBfGtYO0J6Sop5fuHzj73IWpnOEHji6uV8qHuQ8LH0vISKmeH5n0VVAUcuzi8xfvygxvuNnYK8SIIpA4JWD8QwsGKkBzmLeSV9PkOsnGEz9ev+7zNE0My+SonLM5uVKvu24Zl+bv/nlYt8z/tkvJjVpA7odUWfQ2H+4yvVAEQd73+PKmCRXhZI6LA3PWA3M7pJkTGSu6cpe/k9ok2mVGipmp/sHM08unXX/Q0lYQm8Nc7M3MzECNyJSDBpQcUyHvCad/Pc6WFpBSPULADdqXs+zH2aIR9la93LV0E1GIPyo5G+S2z9m8kZqgf1cFFsLpX56ZtQsNSiM4r2qcC6f/nXO2t3avRcXmVERn74yzRTA+Z72E9e5XKLM6uuX+cwLcqEr/XjD5+83X676gl0bPTnyjMx1J1HBEAvdb7Mfql9OanO0FLR8IxBQApLH6sQJX/PutxdkBuJ3q8mr0r32atcWv44f+AfiGEByIswgNByyremyAr42cTyfPbAL58tDoKRW8q31p4nO2tx9XgD708FftM8GZa3tr9KASJ3qKQrFdDsZZNCDHH3tmPO4zV1Nenr78dmR8yxnlfzX92zKbhvd3TDx1QLwJs3Kgf2XPwpQz+ygyjtQf6M3fu+IS2zv+xfiZegN99/ns2Njplb+ajwiwX4ElzXeXcD8moJAlBfatrvz9aJnRvv+dsjk/puLaD+1mYpOthG1HG3MJh7oeL0fGBWecW0fMfvvktvNxIayh5z//1nKmShHglAAAAABJRU5ErkJggg=="
        {...rest}
      />
    </ExternalLink>
  )
}
