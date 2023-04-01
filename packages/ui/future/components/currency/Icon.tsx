import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import chains, { ChainId } from '@sushiswap/chain'
import { Currency } from '@sushiswap/currency'
import { WrappedTokenInfo } from '@sushiswap/token-lists'
import Image, { ImageProps } from 'next/legacy/image'
import { DetailedHTMLProps, FC, ImgHTMLAttributes, useEffect, useMemo, useState } from 'react'
import { cloudinaryImageLoader } from '../../../cloudinary'

import { ExternalLink } from '../ExternalLink'
import { GradientCircleIcon } from '../icons'

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
const BttcLogo = 'https://raw.githubusercontent.com/sushiswap/list/master/logos/native-currency-logos/bttc.svg'

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

export interface IconProps extends Omit<ImageProps, 'src'> {
  currency: Currency
  disableLink?: boolean
}

export const Icon: FC<IconProps> = ({ currency, disableLink, ...rest }) => {
  const [error, setError] = useState(false)

  const src = useMemo(() => {
    if (!currency) return null
    return `tokens/${currency.chainId}/${currency.wrapped.address}.jpg`
  }, [currency])

  useEffect(() => {
    setError(false)
  }, [src])

  const placeholder = useMemo(() => {
    if (!rest.width || !rest.height) return 'empty'
    if (rest.width < 40 || rest.height < 40) return 'empty'
    return 'blur'
  }, [rest?.width, rest?.height])

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
          {currency.symbol?.substring(0, 2) ?? '??'}
        </div>
      )
    }

    return (
      <ExternalLink className="flex" href={chains[currency.chainId].getTokenUrl(currency.wrapped.address)}>
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
        alt={currency.name}
        className="rounded-full"
        // @ts-ignore
        width={rest.width}
        // @ts-ignore
        height={rest.height}
        loader={cloudinaryImageLoader}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADhUlEQVRIx6VXz48UVRD+qmb6DXhQNoYYsy6rrFGMUSCYrDvgwauJ2cOGMTHGmzcjuAZiSNCOgWhUMGjixT9AYCFkb8aDMSQLRpCbF91FZRFcLuuvDUq26/PQs83rntc9PdJJJ/XmVb/6ql59VTWCGs/u3WzIpp92NgWTrcTazrDZJTbkjHDGZZfwsktsLjLMPrjy/bnOTCfpd6ZUbU68vrh+aN3qnpZh2hk3uoRwRkSpQaytC/KNKMGRe2/9+Ulnpn1zYMPPHvylExmOOuNwzkCJwQCYxWiV0y/NbD0VOl97fiFlV7wYC+S4AsPKVEkBKAFhilZ8ubuX6ZJQckSFJ09PXXovjqnVHsfUp/Hr547sREm1h84sWwdD761bCU9c2Lb9xTgWC3q8Q68dFqAjBBRcQ57KIISEoPt6Hue8LUaDAIAXdn536Z1gqLcevtpR8M3MgBfGtYO0J6Sop5fuHzj73IWpnOEHji6uV8qHuQ8LH0vISKmeH5n0VVAUcuzi8xfvygxvuNnYK8SIIpA4JWD8QwsGKkBzmLeSV9PkOsnGEz9ev+7zNE0My+SonLM5uVKvu24Zl+bv/nlYt8z/tkvJjVpA7odUWfQ2H+4yvVAEQd73+PKmCRXhZI6LA3PWA3M7pJkTGSu6cpe/k9ok2mVGipmp/sHM08unXX/Q0lYQm8Nc7M3MzECNyJSDBpQcUyHvCad/Pc6WFpBSPULADdqXs+zH2aIR9la93LV0E1GIPyo5G+S2z9m8kZqgf1cFFsLpX56ZtQsNSiM4r2qcC6f/nXO2t3avRcXmVERn74yzRTA+Z72E9e5XKLM6uuX+cwLcqEr/XjD5+83X676gl0bPTnyjMx1J1HBEAvdb7Mfql9OanO0FLR8IxBQApLH6sQJX/PutxdkBuJ3q8mr0r32atcWv44f+AfiGEByIswgNByyremyAr42cTyfPbAL58tDoKRW8q31p4nO2tx9XgD708FftM8GZa3tr9KASJ3qKQrFdDsZZNCDHH3tmPO4zV1Nenr78dmR8yxnlfzX92zKbhvd3TDx1QLwJs3Kgf2XPwpQz+ygyjtQf6M3fu+IS2zv+xfiZegN99/ns2Njplb+ajwiwX4ElzXeXcD8moJAlBfatrvz9aJnRvv+dsjk/puLaD+1mYpOthG1HG3MJh7oeL0fGBWecW0fMfvvktvNxIayh5z//1nKmShHglAAAAABJRU5ErkJggg=="
        {...rest}
      />
    )
  }

  return (
    <ExternalLink className="flex" href={chains[currency.chainId].getTokenUrl(currency.wrapped.address)}>
      <Image
        key={src}
        onError={() => setError(true)}
        src={src}
        alt={currency.name}
        className="rounded-full"
        // @ts-ignore
        width={rest.width}
        // @ts-ignore
        height={rest.height}
        loader={cloudinaryImageLoader}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADhUlEQVRIx6VXz48UVRD+qmb6DXhQNoYYsy6rrFGMUSCYrDvgwauJ2cOGMTHGmzcjuAZiSNCOgWhUMGjixT9AYCFkb8aDMSQLRpCbF91FZRFcLuuvDUq26/PQs83rntc9PdJJJ/XmVb/6ql59VTWCGs/u3WzIpp92NgWTrcTazrDZJTbkjHDGZZfwsktsLjLMPrjy/bnOTCfpd6ZUbU68vrh+aN3qnpZh2hk3uoRwRkSpQaytC/KNKMGRe2/9+Ulnpn1zYMPPHvylExmOOuNwzkCJwQCYxWiV0y/NbD0VOl97fiFlV7wYC+S4AsPKVEkBKAFhilZ8ubuX6ZJQckSFJ09PXXovjqnVHsfUp/Hr547sREm1h84sWwdD761bCU9c2Lb9xTgWC3q8Q68dFqAjBBRcQ57KIISEoPt6Hue8LUaDAIAXdn536Z1gqLcevtpR8M3MgBfGtYO0J6Sop5fuHzj73IWpnOEHji6uV8qHuQ8LH0vISKmeH5n0VVAUcuzi8xfvygxvuNnYK8SIIpA4JWD8QwsGKkBzmLeSV9PkOsnGEz9ev+7zNE0My+SonLM5uVKvu24Zl+bv/nlYt8z/tkvJjVpA7odUWfQ2H+4yvVAEQd73+PKmCRXhZI6LA3PWA3M7pJkTGSu6cpe/k9ok2mVGipmp/sHM08unXX/Q0lYQm8Nc7M3MzECNyJSDBpQcUyHvCad/Pc6WFpBSPULADdqXs+zH2aIR9la93LV0E1GIPyo5G+S2z9m8kZqgf1cFFsLpX56ZtQsNSiM4r2qcC6f/nXO2t3avRcXmVERn74yzRTA+Z72E9e5XKLM6uuX+cwLcqEr/XjD5+83X676gl0bPTnyjMx1J1HBEAvdb7Mfql9OanO0FLR8IxBQApLH6sQJX/PutxdkBuJ3q8mr0r32atcWv44f+AfiGEByIswgNByyremyAr42cTyfPbAL58tDoKRW8q31p4nO2tx9XgD708FftM8GZa3tr9KASJ3qKQrFdDsZZNCDHH3tmPO4zV1Nenr78dmR8yxnlfzX92zKbhvd3TDx1QLwJs3Kgf2XPwpQz+ygyjtQf6M3fu+IS2zv+xfiZegN99/ns2Njplb+ajwiwX4ElzXeXcD8moJAlBfatrvz9aJnRvv+dsjk/puLaD+1mYpOthG1HG3MJh7oeL0fGBWecW0fMfvvktvNxIayh5z//1nKmShHglAAAAABJRU5ErkJggg=="
        {...rest}
      />
    </ExternalLink>
  )
}
