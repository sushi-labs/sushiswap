import { ChainId } from '@sushiswap/chain'
import flatMap from 'lodash.flatmap'

import { BCT, DAI, FRAX, FXS, KLIMA, LUSD, MIM, USDC, USDT, WBTC, WETH9, WNATIVE } from './constants'
import { Token } from './Token'
import { Type } from './Type'

export const BASES_TO_CHECK_TRADES_AGAINST: { readonly [chainId: number]: Token[] } = {
  [ChainId.ETHEREUM]: [
    WNATIVE[ChainId.ETHEREUM],
    WBTC[ChainId.ETHEREUM],
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
    MIM[ChainId.ETHEREUM],
    FRAX[ChainId.ETHEREUM],
    new Token({
      chainId: ChainId.ETHEREUM,
      address: '0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5',
      decimals: 9,
      name: 'Olympus',
      symbol: 'OHM',
    }),
  ],

  [ChainId.RINKEBY]: [WNATIVE[ChainId.RINKEBY], USDC[ChainId.RINKEBY]],
  [ChainId.KOVAN]: [WNATIVE[ChainId.KOVAN], USDC[ChainId.KOVAN]],
  [ChainId.POLYGON]: [
    WNATIVE[ChainId.POLYGON],
    WETH9[ChainId.POLYGON],
    WBTC[ChainId.POLYGON],
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
    MIM[ChainId.POLYGON],
    FRAX[ChainId.POLYGON],
    new Token({
      chainId: ChainId.POLYGON,
      address: '0x2F800Db0fdb5223b3C3f354886d907A671414A7F',
      decimals: 18,
      name: 'Toucan Protocol: Base Carbon Tonne',
      symbol: 'BCT',
    }),
  ],
  [ChainId.POLYGON_TESTNET]: [WNATIVE[ChainId.POLYGON_TESTNET], USDC[ChainId.POLYGON_TESTNET]],
  [ChainId.FANTOM]: [
    WNATIVE[ChainId.FANTOM],
    WETH9[ChainId.FANTOM],
    WBTC[ChainId.FANTOM],
    USDC[ChainId.FANTOM],
    USDT[ChainId.FANTOM],
    DAI[ChainId.FANTOM],
    MIM[ChainId.FANTOM],
    FRAX[ChainId.FANTOM],
  ],
  [ChainId.GNOSIS]: [WNATIVE[ChainId.GNOSIS], USDC[ChainId.GNOSIS], USDT[ChainId.GNOSIS], DAI[ChainId.GNOSIS]],
  [ChainId.BSC]: [
    WNATIVE[ChainId.BSC],
    WETH9[ChainId.BSC],
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    DAI[ChainId.BSC],
    MIM[ChainId.BSC],
    FRAX[ChainId.BSC],
  ],
  [ChainId.ARBITRUM]: [
    WNATIVE[ChainId.ARBITRUM],
    WBTC[ChainId.ARBITRUM],
    USDC[ChainId.ARBITRUM],
    USDT[ChainId.ARBITRUM],
    DAI[ChainId.ARBITRUM],
    MIM[ChainId.ARBITRUM],
    FRAX[ChainId.ARBITRUM],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    WNATIVE[ChainId.ARBITRUM_NOVA],
    WBTC[ChainId.ARBITRUM_NOVA],
    USDC[ChainId.ARBITRUM_NOVA],
    USDT[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.AVALANCHE]: [
    WNATIVE[ChainId.AVALANCHE],
    WETH9[ChainId.AVALANCHE],
    WBTC[ChainId.AVALANCHE],
    new Token({
      chainId: ChainId.AVALANCHE,
      address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      decimals: 18,
      symbol: 'USDC.e',
      name: 'USD Coin',
    }),
    USDC[ChainId.AVALANCHE],
    USDT[ChainId.AVALANCHE],
    new Token({
      chainId: ChainId.AVALANCHE,
      address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
      decimals: 18,
      symbol: 'USDT.e',
      name: 'Tether USD',
    }),
    DAI[ChainId.AVALANCHE],
    MIM[ChainId.AVALANCHE],
    FRAX[ChainId.AVALANCHE],
    new Token({
      chainId: ChainId.AVALANCHE,
      address: '0x0da67235dD5787D67955420C84ca1cEcd4E5Bb3b',
      decimals: 18,
      name: 'Wrapped MEMO',
      symbol: 'WMEMO',
    }),
  ],

  [ChainId.HECO]: [WNATIVE[ChainId.HECO], USDC[ChainId.HECO], USDT[ChainId.HECO], DAI[ChainId.HECO]],
  [ChainId.HARMONY]: [
    WNATIVE[ChainId.HARMONY],
    USDC[ChainId.HARMONY],
    USDT[ChainId.HARMONY],
    DAI[ChainId.HARMONY],
    FRAX[ChainId.HARMONY],
  ],
  [ChainId.OKEX]: [WNATIVE[ChainId.OKEX], USDC[ChainId.OKEX], USDT[ChainId.OKEX], DAI[ChainId.OKEX]],
  [ChainId.CELO]: [
    WNATIVE[ChainId.CELO],
    USDC[ChainId.CELO],
    USDT[ChainId.CELO],
    DAI[ChainId.CELO],
    new Token({
      chainId: ChainId.CELO,
      address: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
      decimals: 18,
      symbol: 'cEUR',
      name: 'Celo Euro',
    }),
    new Token({
      chainId: ChainId.CELO,
      address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
      decimals: 18,
      symbol: 'cUSD',
      name: 'Celo Dollar',
    }),
    new Token({
      chainId: ChainId.CELO,
      address: '0x2DEf4285787d58a2f811AF24755A8150622f4361',
      decimals: 18,
      symbol: 'cETH',
      name: 'Celo Ether',
    }),
    new Token({
      chainId: ChainId.CELO,
      address: '0xD629eb00dEced2a080B7EC630eF6aC117e614f1b',
      decimals: 18,
      symbol: 'cBTC',
      name: 'Celo Bitcoin',
    }),
  ],
  [ChainId.PALM]: [WNATIVE[ChainId.PALM]],
  [ChainId.MOONRIVER]: [
    WNATIVE[ChainId.MOONRIVER],
    USDC[ChainId.MOONRIVER],
    USDT[ChainId.MOONRIVER],
    DAI[ChainId.MOONRIVER],
    MIM[ChainId.MOONRIVER],
    FRAX[ChainId.MOONRIVER],
  ],
  [ChainId.FUSE]: [WNATIVE[ChainId.FUSE], USDC[ChainId.FUSE], USDT[ChainId.FUSE], DAI[ChainId.FUSE]],
  [ChainId.TELOS]: [WNATIVE[ChainId.TELOS], USDC[ChainId.TELOS], USDT[ChainId.TELOS]],
  [ChainId.MOONBEAM]: [
    WNATIVE[ChainId.MOONBEAM],
    USDC[ChainId.MOONBEAM],
    USDT[ChainId.MOONBEAM],
    DAI[ChainId.MOONBEAM],
    FRAX[ChainId.MOONBEAM],
  ],
  [ChainId.OPTIMISM]: [
    WNATIVE[ChainId.OPTIMISM],
    WBTC[ChainId.OPTIMISM],
    USDC[ChainId.OPTIMISM],
    USDT[ChainId.OPTIMISM],
    DAI[ChainId.OPTIMISM],
    LUSD[ChainId.OPTIMISM],
    FRAX[ChainId.OPTIMISM],
  ],
  [ChainId.KAVA]: [
    WNATIVE[ChainId.KAVA],
    WETH9[ChainId.KAVA],
    WBTC[ChainId.KAVA],
    USDC[ChainId.KAVA],
    USDT[ChainId.KAVA],
    DAI[ChainId.KAVA],
  ],
  [ChainId.METIS]: [WNATIVE[ChainId.METIS]],
  [ChainId.BOBA]: [
    WNATIVE[ChainId.BOBA],
    USDC[ChainId.BOBA],
    USDT[ChainId.BOBA],
    DAI[ChainId.BOBA],
    FRAX[ChainId.BOBA],
    WBTC[ChainId.BOBA],
  ],
  // [ChainId.BOBA_AVAX]: [WNATIVE[ChainId.BOBA_AVAX]],
}

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.ETHEREUM]: {
    [FRAX[ChainId.ETHEREUM].address]: [FRAX[ChainId.ETHEREUM]],
    [FXS[ChainId.ETHEREUM].address]: [FXS[ChainId.ETHEREUM]],
  },
  [ChainId.POLYGON]: {
    [FRAX[ChainId.POLYGON].address]: [FRAX[ChainId.POLYGON]],
    [FXS[ChainId.POLYGON].address]: [FXS[ChainId.POLYGON]],
  },
  [ChainId.ARBITRUM]: {
    [FRAX[ChainId.ARBITRUM].address]: [FRAX[ChainId.ARBITRUM]],
    [FXS[ChainId.ARBITRUM].address]: [FXS[ChainId.ARBITRUM]],
  },
  [ChainId.FANTOM]: {
    [FRAX[ChainId.FANTOM].address]: [FRAX[ChainId.FANTOM]],
    [FXS[ChainId.FANTOM].address]: [FXS[ChainId.FANTOM]],
  },
  [ChainId.BSC]: {
    [FRAX[ChainId.BSC].address]: [FRAX[ChainId.BSC]],
    [FXS[ChainId.BSC].address]: [FXS[ChainId.BSC]],
  },
  [ChainId.AVALANCHE]: {
    [FRAX[ChainId.AVALANCHE].address]: [FRAX[ChainId.AVALANCHE]],
    [FXS[ChainId.AVALANCHE].address]: [FXS[ChainId.AVALANCHE]],
  },
  [ChainId.MOONRIVER]: {
    [FRAX[ChainId.MOONRIVER].address]: [FRAX[ChainId.MOONRIVER]],
    [FXS[ChainId.MOONRIVER].address]: [FXS[ChainId.MOONRIVER]],
  },
  [ChainId.MOONBEAM]: {
    [FRAX[ChainId.MOONBEAM].address]: [FRAX[ChainId.MOONBEAM]],
    [FXS[ChainId.MOONBEAM].address]: [FXS[ChainId.MOONBEAM]],
  },
  [ChainId.HARMONY]: {
    [FRAX[ChainId.HARMONY].address]: [FRAX[ChainId.HARMONY]],
    [FXS[ChainId.HARMONY].address]: [FXS[ChainId.HARMONY]],
  },
  [ChainId.BOBA]: {
    [FRAX[ChainId.BOBA].address]: [FRAX[ChainId.BOBA]],
    [FXS[ChainId.BOBA].address]: [FXS[ChainId.BOBA]],
  },
  [ChainId.OPTIMISM]: {
    [FRAX[ChainId.OPTIMISM].address]: [FRAX[ChainId.OPTIMISM]],
    [FXS[ChainId.OPTIMISM].address]: [FXS[ChainId.OPTIMISM]],
  },
  [ChainId.POLYGON]: {
    [BCT[ChainId.POLYGON].address]: [KLIMA[ChainId.POLYGON]],
    [KLIMA[ChainId.POLYGON].address]: [BCT[ChainId.POLYGON]],
    [FRAX[ChainId.POLYGON].address]: [FRAX[ChainId.POLYGON]],
    [FXS[ChainId.POLYGON].address]: [FXS[ChainId.POLYGON]],
  },
}

export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {}

export const COMMON_BASES: { readonly [chainId: number]: Token[] } = {
  [ChainId.AVALANCHE]: [
    WNATIVE[ChainId.AVALANCHE],
    WETH9[ChainId.FANTOM],
    USDC[ChainId.AVALANCHE],
    USDT[ChainId.AVALANCHE],
    DAI[ChainId.AVALANCHE],
    MIM[ChainId.AVALANCHE],
    FRAX[ChainId.AVALANCHE],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    WNATIVE[ChainId.ARBITRUM_NOVA],
    WBTC[ChainId.ARBITRUM_NOVA],
    USDC[ChainId.ARBITRUM_NOVA],
    USDT[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.BOBA]: [
    WNATIVE[ChainId.BOBA],
    USDC[ChainId.BOBA],
    USDT[ChainId.BOBA],
    DAI[ChainId.BOBA],
    FRAX[ChainId.BOBA],
    WBTC[ChainId.BOBA],
  ],
}

export function getCurrencyCombinations(chainId: number, currencyA: Type, currencyB: Type) {
  const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]

  const common = chainId in BASES_TO_CHECK_TRADES_AGAINST ? BASES_TO_CHECK_TRADES_AGAINST[chainId] : []
  const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
  const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

  const bases: Token[] = [...common, ...additionalA, ...additionalB]

  const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] =>
    bases.map((otherBase) => [base, otherBase])
  )

  if (!tokenA || !tokenB) {
    return []
  }

  return [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base): [Token, Token] => [tokenA, base]),
    // token B against all bases
    ...bases.map((base): [Token, Token] => [tokenB, base]),
    // each base against all bases
    ...basePairs,
  ]
    .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
    .filter(([t0, t1]) => t0.address !== t1.address)
    .filter(([tokenA, tokenB]) => {
      if (!chainId) return true
      const customBases = CUSTOM_BASES[chainId]

      const customBasesA: Token[] | undefined = customBases?.[tokenA.address]
      const customBasesB: Token[] | undefined = customBases?.[tokenB.address]

      if (!customBasesA && !customBasesB) return true

      if (customBasesA && !customBasesA.find((base) => tokenB.equals(base))) return false
      if (customBasesB && !customBasesB.find((base) => tokenA.equals(base))) return false

      return true
    })
}
