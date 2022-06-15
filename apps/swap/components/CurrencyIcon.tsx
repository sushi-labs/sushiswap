import { ChainId } from '@sushiswap/chain'
import { Currency } from '@sushiswap/currency'
import { WrappedTokenInfo } from '@sushiswap/token-lists'
import Image, { ImageProps } from 'next/image'
import { useMemo } from 'react'

const BLOCKCHAIN: Record<number, string> = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'binance',
  [ChainId.CELO]: 'celo',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.AVALANCHE_TESTNET]: 'fuji',
  [ChainId.FUSE]: 'fuse',
  [ChainId.HARMONY]: 'harmony',
  [ChainId.HECO]: 'heco',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.OKEX]: 'okex',
  [ChainId.PALM]: 'palm',
  [ChainId.TELOS]: 'telos',
  [ChainId.GNOSIS]: 'gnosis',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.MOONBEAM]: 'moonbeam',
}

export function CurrencyIcon({ currency, ...rest }: { currency: Currency } & Omit<ImageProps, 'src'>) {
  const src = useMemo(() => {
    if (currency.isNative) {
      return `https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/${
        BLOCKCHAIN[currency.chainId]
      }/${currency.wrapped.address}.jpg`
    }

    if (currency instanceof WrappedTokenInfo && currency.logoURI) {
      return currency.logoURI
    }

    // TODO: Currency logos should be accessed via proxy such as...
    // https://currency.sushi.com/{chainId}/{identifier}.png
    // e.g.
    // https://currency.sushi.com/1/native.png - ETH
    // https://currency.sushi.com/1/0x...png - WETH
    return 'https://'
  }, [currency])

  return <Image src={src} alt={currency.name} className="rounded-full" {...rest} />
}
