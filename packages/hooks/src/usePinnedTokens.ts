import { getAddress as _getAddress, isAddress } from '@ethersproject/address'
import { ChainId } from 'sushi/chain'
import {
  ARB,
  type Currency,
  DAI,
  FRAX,
  GNO,
  MATIC,
  MIM,
  Native,
  SUSHI,
  Token,
  USDC,
  USDT,
  WBTC,
  WETH9,
  WNATIVE,
} from 'sushi/currency'
import { useCallback, useEffect, useMemo } from 'react'

import { useLocalStorage } from './useLocalStorage'

export const COMMON_BASES = {
  [ChainId.ETHEREUM]: [
    Native.onChain(ChainId.ETHEREUM),
    WNATIVE[ChainId.ETHEREUM],
    SUSHI[ChainId.ETHEREUM],
    WBTC[ChainId.ETHEREUM],
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
  ],
  [ChainId.ROPSTEN]: [],
  [ChainId.RINKEBY]: [],
  [ChainId.GÖRLI]: [],
  [ChainId.KOVAN]: [],
  [ChainId.GNOSIS]: [
    Native.onChain(ChainId.GNOSIS),
    WNATIVE[ChainId.GNOSIS],
    GNO[ChainId.GNOSIS],
    WETH9[ChainId.GNOSIS],
    USDC[ChainId.GNOSIS],
    USDT[ChainId.GNOSIS],
    DAI[ChainId.GNOSIS],
  ],
  [ChainId.BSC]: [
    Native.onChain(ChainId.BSC),
    WNATIVE[ChainId.BSC],
    WETH9[ChainId.BSC],
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    DAI[ChainId.BSC],
  ],
  [ChainId.BSC_TESTNET]: [],
  [ChainId.POLYGON]: [
    Native.onChain(ChainId.POLYGON),
    WNATIVE[ChainId.POLYGON],
    WBTC[ChainId.POLYGON],
    WETH9[ChainId.POLYGON],
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.POLYGON_TESTNET]: [],
  [ChainId.AVALANCHE]: [
    Native.onChain(ChainId.AVALANCHE),
    WNATIVE[ChainId.AVALANCHE],
    WETH9[ChainId.AVALANCHE],
    WBTC[ChainId.AVALANCHE],
    USDC[ChainId.AVALANCHE],
    USDT[ChainId.AVALANCHE],
    DAI[ChainId.AVALANCHE],
    MIM[ChainId.AVALANCHE],
    FRAX[ChainId.AVALANCHE],
  ],
  [ChainId.AVALANCHE_TESTNET]: [],
  [ChainId.ARBITRUM_NOVA]: [
    Native.onChain(ChainId.ARBITRUM_NOVA),
    WNATIVE[ChainId.ARBITRUM_NOVA],
    ARB[ChainId.ARBITRUM_NOVA],
    WBTC[ChainId.ARBITRUM_NOVA],
    USDC[ChainId.ARBITRUM_NOVA],
    USDT[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.BOBA]: [
    Native.onChain(ChainId.BOBA),
    WNATIVE[ChainId.BOBA],
    USDC[ChainId.BOBA],
    USDT[ChainId.BOBA],
    DAI[ChainId.BOBA],
    FRAX[ChainId.BOBA],
    WBTC[ChainId.BOBA],
  ],
  [ChainId.FANTOM]: [
    Native.onChain(ChainId.FANTOM),
    WNATIVE[ChainId.FANTOM],
    WBTC[ChainId.FANTOM],
    WETH9[ChainId.FANTOM],
    USDC[ChainId.FANTOM],
    USDT[ChainId.FANTOM],
    DAI[ChainId.FANTOM],
    MIM[ChainId.FANTOM],
  ],
  [ChainId.FANTOM_TESTNET]: [],
  [ChainId.ARBITRUM]: [
    Native.onChain(ChainId.ARBITRUM),
    WNATIVE[ChainId.ARBITRUM],
    ARB[ChainId.ARBITRUM],
    WBTC[ChainId.ARBITRUM],
    USDC[ChainId.ARBITRUM],
    USDT[ChainId.ARBITRUM],
    DAI[ChainId.ARBITRUM],
    MIM[ChainId.ARBITRUM],
  ],
  [ChainId.ARBITRUM_TESTNET]: [],
  [ChainId.HARMONY]: [
    Native.onChain(ChainId.HARMONY),
    WNATIVE[ChainId.HARMONY],
    WETH9[ChainId.HARMONY],
    USDC[ChainId.HARMONY],
    USDT[ChainId.HARMONY],
    DAI[ChainId.HARMONY],
  ],
  [ChainId.HARMONY_TESTNET]: [],
  [ChainId.HECO]: [
    Native.onChain(ChainId.HECO),
    WNATIVE[ChainId.HECO],
    WETH9[ChainId.HECO],
    USDC[ChainId.HECO],
    USDT[ChainId.HECO],
    DAI[ChainId.HECO],
  ],
  [ChainId.HECO_TESTNET]: [],
  [ChainId.OKEX]: [
    Native.onChain(ChainId.OKEX),
    WNATIVE[ChainId.OKEX],
    WETH9[ChainId.OKEX],
    USDC[ChainId.OKEX],
    USDT[ChainId.OKEX],
    DAI[ChainId.OKEX],
  ],
  [ChainId.OKEX_TESTNET]: [],
  [ChainId.CELO]: [
    Native.onChain(ChainId.CELO),
    // WNATIVE[ChainId.CELO],
    WETH9[ChainId.CELO],
    USDC[ChainId.CELO],
    USDT[ChainId.CELO],
    DAI[ChainId.CELO],
  ],
  [ChainId.PALM]: [
    Native.onChain(ChainId.PALM),
    WNATIVE[ChainId.PALM],
    WETH9[ChainId.PALM],
  ],
  [ChainId.MOONRIVER]: [
    Native.onChain(ChainId.MOONRIVER),
    WNATIVE[ChainId.MOONRIVER],
    WETH9[ChainId.MOONRIVER],
    USDC[ChainId.MOONRIVER],
    USDT[ChainId.MOONRIVER],
    DAI[ChainId.MOONRIVER],
    FRAX[ChainId.MOONRIVER],
  ],
  [ChainId.FUSE]: [
    Native.onChain(ChainId.FUSE),
    WNATIVE[ChainId.FUSE],
    WBTC[ChainId.FUSE],
    WETH9[ChainId.FUSE],
    USDC[ChainId.FUSE],
    USDT[ChainId.FUSE],
    DAI[ChainId.FUSE],
  ],
  [ChainId.TELOS]: [
    Native.onChain(ChainId.TELOS),
    WNATIVE[ChainId.TELOS],
    WETH9[ChainId.TELOS],
    USDC[ChainId.TELOS],
    USDT[ChainId.TELOS],
  ],
  [ChainId.MOONBEAM]: [
    Native.onChain(ChainId.MOONBEAM),
    WNATIVE[ChainId.MOONBEAM],
    WETH9[ChainId.MOONBEAM],
    USDC[ChainId.MOONBEAM],
    USDT[ChainId.MOONBEAM],
    DAI[ChainId.MOONBEAM],
  ],
  [ChainId.OPTIMISM]: [
    Native.onChain(ChainId.OPTIMISM),
    WNATIVE[ChainId.OPTIMISM],
    WBTC[ChainId.OPTIMISM],
    USDC[ChainId.OPTIMISM],
    USDT[ChainId.OPTIMISM],
    DAI[ChainId.OPTIMISM],
  ],
  [ChainId.KAVA]: [
    Native.onChain(ChainId.KAVA),
    WNATIVE[ChainId.KAVA],
    WBTC[ChainId.KAVA],
    WETH9[ChainId.KAVA],
    USDC[ChainId.KAVA],
    USDT[ChainId.KAVA],
    DAI[ChainId.KAVA],
  ],
  [ChainId.METIS]: [
    Native.onChain(ChainId.METIS),
    WNATIVE[ChainId.METIS],
    WBTC[ChainId.METIS],
    WETH9[ChainId.METIS],
    USDC[ChainId.METIS],
    USDT[ChainId.METIS],
    DAI[ChainId.METIS],
  ],
  [ChainId.BOBA_AVAX]: [
    Native.onChain(ChainId.BOBA_AVAX),
    WNATIVE[ChainId.BOBA_AVAX],
    USDC[ChainId.BOBA_AVAX],
    USDT[ChainId.BOBA_AVAX],
  ],
  [ChainId.BOBA_BNB]: [
    Native.onChain(ChainId.BOBA_BNB),
    WNATIVE[ChainId.BOBA_BNB],
    new Token({
      chainId: ChainId.BOBA_BNB,
      symbol: 'BNB',
      name: 'Binance Coin',
      decimals: 18,
      address: '0x4200000000000000000000000000000000000023',
    }),
    USDC[ChainId.BOBA_BNB],
    USDT[ChainId.BOBA_BNB],
  ],
  [ChainId.BTTC]: [
    Native.onChain(ChainId.BTTC),
    WNATIVE[ChainId.BTTC],
    WETH9[ChainId.BTTC],
    USDC[ChainId.BTTC],
    USDT[ChainId.BTTC],
  ],
  // [ChainId.CONSENSUS_ZKEVM_TESTNET]: [
  //   Native.onChain(ChainId.CONSENSUS_ZKEVM_TESTNET),
  //   WNATIVE[ChainId.CONSENSUS_ZKEVM_TESTNET],
  // ],
  // [ChainId.SCROLL_ALPHA_TESTNET]: [Native.onChain(ChainId.SCROLL_ALPHA_TESTNET), WNATIVE[ChainId.SCROLL_ALPHA_TESTNET]],
  // [ChainId.BASE_TESTNET]: [Native.onChain(ChainId.BASE_TESTNET), WNATIVE[ChainId.BASE_TESTNET]],
  [ChainId.POLYGON_ZKEVM]: [
    Native.onChain(ChainId.POLYGON_ZKEVM),
    WNATIVE[ChainId.POLYGON_ZKEVM],
    MATIC[ChainId.POLYGON_ZKEVM],
    USDC[ChainId.POLYGON_ZKEVM],
    USDT[ChainId.POLYGON_ZKEVM],
    DAI[ChainId.POLYGON_ZKEVM],
    WBTC[ChainId.POLYGON_ZKEVM],
  ],
  [ChainId.THUNDERCORE]: [
    Native.onChain(ChainId.THUNDERCORE),
    WNATIVE[ChainId.THUNDERCORE],
    WETH9[ChainId.THUNDERCORE],
    USDC[ChainId.THUNDERCORE],
    USDT[ChainId.THUNDERCORE],
    WBTC[ChainId.THUNDERCORE],
  ],
  [ChainId.HAQQ]: [
    Native.onChain(ChainId.HAQQ),
    WNATIVE[ChainId.HAQQ],
    WETH9[ChainId.HAQQ],
    WBTC[ChainId.HAQQ],
    USDC[ChainId.HAQQ],
    USDT[ChainId.HAQQ],
    DAI[ChainId.HAQQ],
  ],
  [ChainId.CORE]: [
    Native.onChain(ChainId.CORE),
    WNATIVE[ChainId.CORE],
    WETH9[ChainId.CORE],
    USDC[ChainId.CORE],
    USDT[ChainId.CORE],
  ],
  [ChainId.ZKSYNC_ERA]: [
    Native.onChain(ChainId.ZKSYNC_ERA),
    WNATIVE[ChainId.ZKSYNC_ERA],
    WBTC[ChainId.ZKSYNC_ERA],
    USDC[ChainId.ZKSYNC_ERA],
  ],
  [ChainId.LINEA]: [
    Native.onChain(ChainId.LINEA),
    WNATIVE[ChainId.LINEA],
    DAI[ChainId.LINEA],
    USDC[ChainId.LINEA],
  ],
  [ChainId.BASE]: [
    Native.onChain(ChainId.BASE),
    WNATIVE[ChainId.BASE],
    DAI[ChainId.BASE],
    new Token({
      chainId: ChainId.BASE,
      symbol: 'USDbC',
      name: 'USD Base Coin',
      decimals: 6,
      address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    }),
    USDC[ChainId.BASE],
  ],
  // [ChainId.SEPOLIA]: [Native.onChain(ChainId.SEPOLIA), WNATIVE[ChainId.SEPOLIA]],
} as const

const COMMON_BASES_IDS = Object.entries(COMMON_BASES).reduce<
  Record<string, string[]>
>((acc, [chain, tokens]) => {
  const chainId = chain
  acc[chainId] = Array.from(new Set(tokens.map((token) => token.id)))
  return acc
}, {} as Record<ChainId, string[]>)

function getAddress(address: string) {
  if (address === 'NATIVE') return 'NATIVE'
  return _getAddress(address)
}

export const usePinnedTokens = () => {
  const [value, setValue] = useLocalStorage(
    'sushi.pinnedTokens',
    COMMON_BASES_IDS,
  )

  useEffect(() => {
    Object.entries(COMMON_BASES_IDS).forEach(([chainId, tokens]) => {
      if (!value[chainId]) {
        value[chainId] = tokens
        setValue(value)
      }
    })
  }, [value])

  const addPinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      value[chainId] = Array.from(
        new Set([...value[chainId], `${chainId}:${getAddress(address)}`]),
      )
      setValue(value)
    },
    [setValue],
  )

  const removePinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      value[chainId] = Array.from(
        new Set(
          value[chainId].filter(
            (token) => token !== `${chainId}:${getAddress(address)}`,
          ),
        ),
      )
      setValue(value)
    },
    [setValue],
  )

  const hasToken = useCallback(
    (currency: Currency | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [chainId, address] = currency.split(':')
        if (address !== 'NATIVE' && !isAddress(address)) {
          throw new Error('Address provided not a valid ERC20 address')
        }

        return value?.[chainId]?.includes(`${chainId}:${getAddress(address)}`)
      }

      return !!value?.[currency.chainId]?.includes(currency.id)
    },
    [value],
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currencyId: string) => {
      if (type === 'add') addPinnedToken(currencyId)
      if (type === 'remove') removePinnedToken(currencyId)
    },
    [addPinnedToken, removePinnedToken],
  )

  return useMemo(() => {
    return {
      data: value,
      mutate,
      hasToken,
    }
  }, [hasToken, mutate, value])
}
