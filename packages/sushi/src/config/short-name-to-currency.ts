import { ChainId } from '../chain/index.js'
import {
  AGEUR,
  DAI,
  FRAX,
  LUSD,
  MAI,
  MIM,
  Native,
  OP,
  SUSHI,
  Token,
  Type,
  UNI,
  USDB,
  USDC,
  USDT,
  WBTC,
  WETH9,
  WNATIVE,
} from '../currency/index.js'

const CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY = {
  [ChainId.ARBITRUM]: {
    // NATIVE: Native.onChain(ChainId.ARBITRUM),
    // WNATIVE: WNATIVE[ChainId.ARBITRUM],
    ETH: Native.onChain(ChainId.ARBITRUM),
    WETH: WNATIVE[ChainId.ARBITRUM],
    WBTC: WBTC[ChainId.ARBITRUM],
    USDC: USDC[ChainId.ARBITRUM],
    USDT: USDT[ChainId.ARBITRUM],
    DAI: DAI[ChainId.ARBITRUM],
    FRAX: FRAX[ChainId.ARBITRUM],
    MIM: MIM[ChainId.ARBITRUM],
    SUSHI: SUSHI[ChainId.ARBITRUM],
    MAI: MAI[ChainId.ARBITRUM],
    UNI: UNI[ChainId.ARBITRUM],
    AGEUR: AGEUR[ChainId.ARBITRUM],
  },
  [ChainId.ARBITRUM_NOVA]: {
    ETH: Native.onChain(ChainId.ARBITRUM_NOVA),
    WETH: WNATIVE[ChainId.ARBITRUM_NOVA],
    SUSHI: SUSHI[ChainId.ARBITRUM_NOVA],
  },
  [ChainId.AVALANCHE]: {
    // NATIVE: Native.onChain(ChainId.AVALANCHE),
    // WNATIVE: WNATIVE[ChainId.AVALANCHE],
    AVAX: Native.onChain(ChainId.AVALANCHE),
    WAVAX: WNATIVE[ChainId.AVALANCHE],
    ETH: WETH9[ChainId.AVALANCHE],
    WETH: WETH9[ChainId.AVALANCHE],
    WBTC: WBTC[ChainId.AVALANCHE],
    USDC: USDC[ChainId.AVALANCHE],
    USDT: USDT[ChainId.AVALANCHE],
    DAI: DAI[ChainId.AVALANCHE],
    FRAX: FRAX[ChainId.AVALANCHE],
    MIM: MIM[ChainId.AVALANCHE],
    SUSHI: SUSHI[ChainId.AVALANCHE],
    MAI: MAI[ChainId.AVALANCHE],
    UNI: UNI[ChainId.AVALANCHE],
    AGEUR: AGEUR[ChainId.AVALANCHE],
  },
  [ChainId.BOBA]: {
    ETH: Native.onChain(ChainId.BOBA),
    WETH: WNATIVE[ChainId.BOBA],
    SUSHI: SUSHI[ChainId.BOBA],
  },
  [ChainId.BOBA_AVAX]: {
    BOBA: Native.onChain(ChainId.BOBA_AVAX),
    WBOBA: WNATIVE[ChainId.BOBA_AVAX],
    USDC: USDC[ChainId.BOBA_AVAX],
    // SUSHI: SUSHI[ChainId.BOBA_AVAX],
  },
  [ChainId.BOBA_BNB]: {
    BOBA: Native.onChain(ChainId.BOBA_BNB),
    WBOBA: WNATIVE[ChainId.BOBA_BNB],
    USDC: USDC[ChainId.BOBA_BNB],
    BNB: new Token({
      chainId: ChainId.BOBA_BNB,
      symbol: 'BNB',
      name: 'Binance Coin',
      decimals: 18,
      address: '0x4200000000000000000000000000000000000023',
    }),
    // SUSHI: SUSHI[ChainId.BOBA_BNB],
  },
  [ChainId.BSC]: {
    // NATIVE: Native.onChain(ChainId.BSC),
    // WNATIVE: WNATIVE[ChainId.BSC],
    BNB: Native.onChain(ChainId.BSC),
    WBNB: WNATIVE[ChainId.BSC],
    ETH: WETH9[ChainId.BSC],
    WETH: WETH9[ChainId.BSC],
    USDC: USDC[ChainId.BSC],
    USDT: USDT[ChainId.BSC],
    DAI: DAI[ChainId.BSC],
    FRAX: FRAX[ChainId.BSC],
    MIM: MIM[ChainId.BSC],
    SUSHI: SUSHI[ChainId.BSC],
    MAI: MAI[ChainId.BSC],
    UNI: UNI[ChainId.BSC],
    AGEUR: AGEUR[ChainId.BSC],
  },
  [ChainId.BTTC]: {
    BTT: Native.onChain(ChainId.BTTC),
    WBTT: WNATIVE[ChainId.BTTC],
    SUSHI: SUSHI[ChainId.BTTC],
  },
  [ChainId.CELO]: {
    CELO: Native.onChain(ChainId.CELO),
    WCELO: WNATIVE[ChainId.CELO],
    SUSHI: SUSHI[ChainId.CELO],
    AGEUR: AGEUR[ChainId.CELO],
  },
  [ChainId.ETHEREUM]: {
    // NATIVE: Native.onChain(ChainId.ETHEREUM),
    // WNATIVE: WETH9[ChainId.ETHEREUM],
    ETH: Native.onChain(ChainId.ETHEREUM),
    WETH: WETH9[ChainId.ETHEREUM],
    WBTC: WBTC[ChainId.ETHEREUM],
    USDC: USDC[ChainId.ETHEREUM],
    USDT: USDT[ChainId.ETHEREUM],
    DAI: DAI[ChainId.ETHEREUM],
    FRAX: FRAX[ChainId.ETHEREUM],
    MIM: MIM[ChainId.ETHEREUM],
    SUSHI: SUSHI[ChainId.ETHEREUM],
    MAI: MAI[ChainId.ETHEREUM],
    UNI: UNI[ChainId.ETHEREUM],
    LUSD: LUSD[ChainId.ETHEREUM],
    AGEUR: AGEUR[ChainId.ETHEREUM],
  },
  [ChainId.FANTOM]: {
    // NATIVE: Native.onChain(ChainId.FANTOM),
    // WNATIVE: WNATIVE[ChainId.FANTOM],
    FTM: Native.onChain(ChainId.FANTOM),
    WFTM: WNATIVE[ChainId.FANTOM],
    FRAX: FRAX[ChainId.FANTOM],
    MIM: MIM[ChainId.FANTOM],
    SUSHI: SUSHI[ChainId.FANTOM],
    MAI: MAI[ChainId.FANTOM],
  },
  [ChainId.FUSE]: {
    FUSE: Native.onChain(ChainId.FUSE),
    WFUSE: WNATIVE[ChainId.FUSE],
    SUSHI: SUSHI[ChainId.FUSE],
  },
  [ChainId.GNOSIS]: {
    XDAI: Native.onChain(ChainId.GNOSIS),
    WXDAI: WNATIVE[ChainId.GNOSIS],
    SUSHI: SUSHI[ChainId.GNOSIS],
    AGEUR: AGEUR[ChainId.GNOSIS],
  },
  [ChainId.KAVA]: {
    KAVA: Native.onChain(ChainId.KAVA),
    WKAVA: WNATIVE[ChainId.KAVA],
    SUSHI: SUSHI[ChainId.KAVA],
  },
  [ChainId.METIS]: {
    METIS: Native.onChain(ChainId.METIS),
    WMETIS: WNATIVE[ChainId.METIS],
    SUSHI: SUSHI[ChainId.METIS],
  },
  [ChainId.MOONBEAM]: {
    GLMR: Native.onChain(ChainId.MOONBEAM),
    WGLMR: WNATIVE[ChainId.MOONBEAM],
    SUSHI: SUSHI[ChainId.MOONBEAM],
  },
  [ChainId.MOONRIVER]: {
    MOVR: Native.onChain(ChainId.MOONRIVER),
    WMOVR: WNATIVE[ChainId.MOONRIVER],
    SUSHI: SUSHI[ChainId.MOONRIVER],
  },

  [ChainId.OPTIMISM]: {
    // NATIVE: Native.onChain(ChainId.OPTIMISM),
    // WNATIVE: WNATIVE[ChainId.OPTIMISM],
    ETH: Native.onChain(ChainId.OPTIMISM),
    WETH: WNATIVE[ChainId.OPTIMISM],
    USDC: USDC[ChainId.OPTIMISM],
    USDT: USDT[ChainId.OPTIMISM],
    OP: OP[ChainId.OPTIMISM],
    SUSHI: SUSHI[ChainId.OPTIMISM],
    AGEUR: AGEUR[ChainId.OPTIMISM],
  },
  [ChainId.POLYGON]: {
    // NATIVE: Native.onChain(ChainId.POLYGON),
    // WNATIVE: WNATIVE[ChainId.POLYGON],
    MATIC: Native.onChain(ChainId.POLYGON),
    WMATIC: WNATIVE[ChainId.POLYGON],
    ETH: WETH9[ChainId.POLYGON],
    WETH: WETH9[ChainId.POLYGON],
    WBTC: WBTC[ChainId.POLYGON],
    USDC: USDC[ChainId.POLYGON],
    USDT: USDT[ChainId.POLYGON],
    DAI: DAI[ChainId.POLYGON],
    FRAX: FRAX[ChainId.POLYGON],
    MIM: MIM[ChainId.POLYGON],
    SUSHI: SUSHI[ChainId.POLYGON],
    MAI: MAI[ChainId.POLYGON],
    UNI: UNI[ChainId.POLYGON],
    AGEUR: AGEUR[ChainId.POLYGON],
  },
  [ChainId.HARMONY]: {
    ONE: Native.onChain(ChainId.HARMONY),
    WONE: WNATIVE[ChainId.HARMONY],
    SUSHI: SUSHI[ChainId.HARMONY],
  },
  // [ChainId.SCROLL_ALPHA_TESTNET]: {
  //   ETH: Native.onChain(ChainId.SCROLL_ALPHA_TESTNET),
  //   WETH: WNATIVE[ChainId.SCROLL_ALPHA_TESTNET],
  // },
  // [ChainId.CONSENSUS_ZKEVM_TESTNET]: {
  //   ETH: Native.onChain(ChainId.CONSENSUS_ZKEVM_TESTNET),
  //   WETH: WNATIVE[ChainId.CONSENSUS_ZKEVM_TESTNET],
  // },
  // [ChainId.BASE_TESTNET]: {
  //   ETH: Native.onChain(ChainId.BASE_TESTNET),
  //   WETH: WNATIVE[ChainId.BASE_TESTNET],
  // },
  [ChainId.THUNDERCORE]: {
    NATIVE: Native.onChain(ChainId.THUNDERCORE),
    WNATIVE: WNATIVE[ChainId.THUNDERCORE],
    SUSHI: SUSHI[ChainId.THUNDERCORE],
  },
  [ChainId.POLYGON_ZKEVM]: {
    NATIVE: Native.onChain(ChainId.POLYGON_ZKEVM),
    WNATIVE: WNATIVE[ChainId.POLYGON_ZKEVM],
    ETH: Native.onChain(ChainId.POLYGON_ZKEVM),
    WETH: WNATIVE[ChainId.POLYGON_ZKEVM],
  },
  [ChainId.CORE]: {
    NATIVE: Native.onChain(ChainId.CORE),
    WNATIVE: WNATIVE[ChainId.CORE],
    ETH: WETH9[ChainId.CORE],
    WETH: WETH9[ChainId.CORE],
  },
  [ChainId.HAQQ]: {
    NATIVE: Native.onChain(ChainId.HAQQ),
    WNATIVE: WNATIVE[ChainId.HAQQ],
    ETH: WETH9[ChainId.HAQQ],
    WETH: WETH9[ChainId.HAQQ],
  },
  [ChainId.ZKSYNC_ERA]: {
    NATIVE: Native.onChain(ChainId.ZKSYNC_ERA),
    WNATIVE: WNATIVE[ChainId.ZKSYNC_ERA],
    ETH: Native.onChain(ChainId.ZKSYNC_ERA),
    WETH: WNATIVE[ChainId.ZKSYNC_ERA],
  },
  [ChainId.LINEA]: {
    NATIVE: Native.onChain(ChainId.LINEA),
    WNATIVE: WNATIVE[ChainId.LINEA],
    ETH: Native.onChain(ChainId.LINEA),
    WETH: WNATIVE[ChainId.LINEA],
  },
  [ChainId.BASE]: {
    NATIVE: Native.onChain(ChainId.BASE),
    WNATIVE: WNATIVE[ChainId.BASE],
    ETH: Native.onChain(ChainId.BASE),
    WETH: WNATIVE[ChainId.BASE],
  },
  [ChainId.SCROLL]: {
    NATIVE: Native.onChain(ChainId.SCROLL),
    WNATIVE: WNATIVE[ChainId.SCROLL],
    ETH: Native.onChain(ChainId.SCROLL),
    WETH: WNATIVE[ChainId.SCROLL],
  },
  [ChainId.FILECOIN]: {
    NATIVE: Native.onChain(ChainId.FILECOIN),
    WNATIVE: WNATIVE[ChainId.FILECOIN],
  },
  [ChainId.ZETACHAIN]: {
    NATIVE: Native.onChain(ChainId.ZETACHAIN),
    WNATIVE: WNATIVE[ChainId.ZETACHAIN],
  },
  [ChainId.BLAST]: {
    NATIVE: Native.onChain(ChainId.BLAST),
    WNATIVE: WNATIVE[ChainId.BLAST],
    USDB: USDB[ChainId.BLAST],
  },
} as const

export type ShortCurrencyNameChainId =
  keyof typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

export type ShortCurrencyName =
  keyof (typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY)[ShortCurrencyNameChainId]

export const isShortCurrencyNameSupported = (
  chainId: ChainId,
): chainId is ShortCurrencyNameChainId =>
  chainId in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

export const isShortCurrencyName = (
  chainId: ChainId,
  shortCurrencyName: string,
): shortCurrencyName is ShortCurrencyName => {
  return (
    isShortCurrencyNameSupported(chainId) &&
    shortCurrencyName in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId]
  )
}

export const currencyFromShortCurrencyName = (
  chainId: ChainId,
  shortCurrencyName: ShortCurrencyName,
): Type => {
  if (!isShortCurrencyNameSupported(chainId))
    throw new Error(
      `Unsupported chain id ${chainId} for short currency name ${shortCurrencyName}`,
    )
  if (!(shortCurrencyName in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId]))
    throw new Error(
      `Unsupported short currency name ${shortCurrencyName} on chain ${chainId}`,
    )
  return CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId][shortCurrencyName]
}
