import { ChainId } from '@sushiswap/chain'
import flatMap from 'lodash.flatmap'

import { DAI, FRAX, FXS, LUSD, MIM, USDC, USDT, WBTC, WETH9, WNATIVE } from './constants'
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
  [ChainId.POLYGON_TESTNET]: [WNATIVE[ChainId.POLYGON_TESTNET], USDC[ChainId.POLYGON_TESTNET]],
  [ChainId.ARBITRUM]: [
    WNATIVE[ChainId.ARBITRUM],
    WBTC[ChainId.ARBITRUM],
    USDC[ChainId.ARBITRUM],
    USDT[ChainId.ARBITRUM],
    DAI[ChainId.ARBITRUM],
    MIM[ChainId.ARBITRUM],
    FRAX[ChainId.ARBITRUM],
  ],
  [ChainId.OPTIMISM]: [
    WNATIVE[ChainId.OPTIMISM],
    WBTC[ChainId.OPTIMISM],
    USDC[ChainId.OPTIMISM],
    USDT[ChainId.OPTIMISM],
    DAI[ChainId.OPTIMISM],
    LUSD[ChainId.OPTIMISM],
  ],
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
  [ChainId.AVALANCHE]: [
    WNATIVE[ChainId.AVALANCHE],
    WETH9[ChainId.AVALANCHE],
    WBTC[ChainId.AVALANCHE],
    USDC[ChainId.AVALANCHE],
    USDT[ChainId.AVALANCHE],
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
  [ChainId.BSC]: [
    WNATIVE[ChainId.BSC],
    WETH9[ChainId.BSC],
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    DAI[ChainId.BSC],
    MIM[ChainId.BSC],
    FRAX[ChainId.BSC],
  ],
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
