// a list of tokens by chain
import { ChainId, SUSHI, Token, WNATIVE } from '@sushiswap/core-sdk'

import * as ARBITRUM from './tokens/arbitrum'
import * as AVALANCHE from './tokens/avalanche'
import * as BSC from './tokens/bsc'
import * as CELO from './tokens/celo'
import * as ETHEREUM from './tokens/ethereum'
import * as FANTOM from './tokens/fantom'
import * as FUSE from './tokens/fuse'
import * as HARMONY from './tokens/harmony'
import * as HECO from './tokens/heco'
import * as MATIC from './tokens/matic'
import * as MOONBEAM from './tokens/moonbeam'
import * as MOONRIVER from './tokens/moonriver'
import * as OKEX from './tokens/okex'
import * as PALM from './tokens/palm'
import * as TELOS from './tokens/telos'
import * as XDAI from './tokens/xdai'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

// List of all mirror's assets addresses.
// Last pulled from : https://whitelist.mirror.finance/eth/tokenlists.json
// TODO: Generate this programmatically ?
const MIRROR_ADDITIONAL_BASES: { [tokenAddress: string]: Token[] } = {
  [ETHEREUM.UST.address]: [ETHEREUM.MIR],
  [ETHEREUM.MIR.address]: [ETHEREUM.UST],
  '0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84': [ETHEREUM.MIR, ETHEREUM.UST], // mAAPL
  '0x59A921Db27Dd6d4d974745B7FfC5c33932653442': [ETHEREUM.MIR, ETHEREUM.UST], // mGOOGL
  '0x21cA39943E91d704678F5D00b6616650F066fD63': [ETHEREUM.MIR, ETHEREUM.UST], // mTSLA
  '0xC8d674114bac90148d11D3C1d33C61835a0F9DCD': [ETHEREUM.MIR, ETHEREUM.UST], // mNFLX
  '0x13B02c8dE71680e71F0820c996E4bE43c2F57d15': [ETHEREUM.MIR, ETHEREUM.UST], // mQQQ
  '0xEdb0414627E6f1e3F082DE65cD4F9C693D78CCA9': [ETHEREUM.MIR, ETHEREUM.UST], // mTWTR
  '0x41BbEDd7286dAab5910a1f15d12CBda839852BD7': [ETHEREUM.MIR, ETHEREUM.UST], // mMSFT
  '0x0cae9e4d663793c2a2A0b211c1Cf4bBca2B9cAa7': [ETHEREUM.MIR, ETHEREUM.UST], // mAMZN
  '0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72': [ETHEREUM.MIR, ETHEREUM.UST], // mBABA
  '0x1d350417d9787E000cc1b95d70E9536DcD91F373': [ETHEREUM.MIR, ETHEREUM.UST], // mIAU
  '0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676': [ETHEREUM.MIR, ETHEREUM.UST], // mSLV
  '0x31c63146a635EB7465e5853020b39713AC356991': [ETHEREUM.MIR, ETHEREUM.UST], // mUSO
  '0xf72FCd9DCF0190923Fadd44811E240Ef4533fc86': [ETHEREUM.MIR, ETHEREUM.UST], // mVIXY
}

const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM]],
  [ChainId.ROPSTEN]: [WNATIVE[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WNATIVE[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WNATIVE[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WNATIVE[ChainId.KOVAN]],
  [ChainId.FANTOM]: [WNATIVE[ChainId.FANTOM]],
  [ChainId.FANTOM_TESTNET]: [WNATIVE[ChainId.FANTOM_TESTNET]],
  [ChainId.MATIC]: [WNATIVE[ChainId.MATIC]],
  [ChainId.MATIC_TESTNET]: [WNATIVE[ChainId.MATIC_TESTNET]],
  [ChainId.XDAI]: [WNATIVE[ChainId.XDAI]],
  [ChainId.BSC]: [WNATIVE[ChainId.BSC]],
  [ChainId.BSC_TESTNET]: [WNATIVE[ChainId.BSC_TESTNET]],
  [ChainId.ARBITRUM]: [WNATIVE[ChainId.ARBITRUM]],
  [ChainId.ARBITRUM_TESTNET]: [WNATIVE[ChainId.ARBITRUM_TESTNET]],
  [ChainId.MOONBEAM_TESTNET]: [WNATIVE[ChainId.MOONBEAM_TESTNET]],
  [ChainId.AVALANCHE]: [WNATIVE[ChainId.AVALANCHE]],
  [ChainId.AVALANCHE_TESTNET]: [WNATIVE[ChainId.AVALANCHE_TESTNET]],
  [ChainId.HECO]: [WNATIVE[ChainId.HECO]],
  [ChainId.HECO_TESTNET]: [WNATIVE[ChainId.HECO_TESTNET]],
  [ChainId.HARMONY]: [WNATIVE[ChainId.HARMONY]],
  [ChainId.HARMONY_TESTNET]: [WNATIVE[ChainId.HARMONY_TESTNET]],
  [ChainId.OKEX]: [WNATIVE[ChainId.OKEX]],
  [ChainId.OKEX_TESTNET]: [WNATIVE[ChainId.OKEX_TESTNET]],
  [ChainId.CELO]: [WNATIVE[ChainId.CELO]],
  [ChainId.MOONRIVER]: [WNATIVE[ChainId.MOONRIVER]],
  [ChainId.PALM]: [WNATIVE[ChainId.PALM]],
  [ChainId.FUSE]: [WNATIVE[ChainId.FUSE]],
  [ChainId.TELOS]: [WNATIVE[ChainId.TELOS]],
  [ChainId.MOONBEAM]: [WNATIVE[ChainId.MOONBEAM]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.ETHEREUM]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.RUNE,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.NFTX,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.STETH,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.OHM_V1,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.OHM_V2,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.ETHEREUM],
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.STG,
  ],
  [ChainId.MATIC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MATIC],
    MATIC.USDC,
    MATIC.WBTC,
    MATIC.DAI,
    MATIC.WETH,
    MATIC.USDT,
    MATIC.MIM,
    MATIC.SUSHI,
    MATIC.FRAX,
    MATIC.STG,
  ],
  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.DAI,
    FANTOM.USDC,
    FANTOM.WBTC,
    FANTOM.WETH,
    FANTOM.MIM,
    FANTOM.FRAX,
    FANTOM.STG,
  ],
  [ChainId.BSC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC],
    BSC.DAI,
    BSC.USD,
    BSC.USDC,
    BSC.USDT,
    BSC.BTCB,
    BSC.WETH,
    BSC.MIM,
    BSC.FRAX,
    BSC.STG,
  ],
  [ChainId.ARBITRUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM],
    ARBITRUM.WBTC,
    ARBITRUM.USDC,
    ARBITRUM.USDT,
    ARBITRUM.MIM,
    ARBITRUM.FRAX,
    ARBITRUM.STG,
  ],
  [ChainId.XDAI]: [...WRAPPED_NATIVE_ONLY[ChainId.XDAI], XDAI.USDC, XDAI.USDT, XDAI.WBTC, XDAI.WETH],
  [ChainId.AVALANCHE]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE],
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.TIME,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.AVALANCHE],
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.STG,
  ],
  [ChainId.HARMONY]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.HARMONY],
    HARMONY.DAI,
    HARMONY.USDC,
    HARMONY.USDT,
    HARMONY.WBTC,
    HARMONY.WETH,
    HARMONY.FRAX,
  ],
  [ChainId.HECO]: [...WRAPPED_NATIVE_ONLY[ChainId.HECO], HECO.DAI, HECO.USDC, HECO.USDT, HECO.WBTC, HECO.WETH],
  [ChainId.OKEX]: [...WRAPPED_NATIVE_ONLY[ChainId.OKEX], OKEX.DAI, OKEX.USDC, OKEX.USDT, OKEX.WBTC, OKEX.WETH],
  [ChainId.CELO]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.CELO],
    CELO.cETH,
    CELO.mCUSD,
    CELO.mCELO,
    CELO.mcEURO,
    CELO.cUSD,
    CELO.cEURO,
    CELO.cBTC,
    CELO.WETH,
    CELO.WBTC,
  ],
  [ChainId.MOONRIVER]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONRIVER],
    MOONRIVER.USDC,
    MOONRIVER.USDT,
    MOONRIVER.WETH,
    MOONRIVER.FRAX,
    MOONRIVER.MIM,
    MOONRIVER.BTC,
    MOONRIVER.ROME,
  ],
  [ChainId.PALM]: [...WRAPPED_NATIVE_ONLY[ChainId.PALM], PALM.WETH, PALM.DAI],
  [ChainId.FUSE]: [...WRAPPED_NATIVE_ONLY[ChainId.FUSE], FUSE.USDC, FUSE.USDT, FUSE.WBTC, FUSE.WETH, FUSE.DAI],
  [ChainId.TELOS]: [...WRAPPED_NATIVE_ONLY[ChainId.TELOS], TELOS.USDC, TELOS.USDT, TELOS.WETH, TELOS.WBTC],
  [ChainId.MOONBEAM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONBEAM],
    MOONBEAM.USDC,
    MOONBEAM.USDT,
    MOONBEAM.UST,
    MOONBEAM.WETH,
    MOONBEAM.WBTC,
    MOONBEAM.FRAX,
  ],
}

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.ETHEREUM]: {
    ...MIRROR_ADDITIONAL_BASES,
    '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETHEREUM.ETH2X_FLI],
    [ETHEREUM.FEI.address]: [ETHEREUM.DPI],
    [ETHEREUM.FRAX.address]: [ETHEREUM.FXS],
    [ETHEREUM.FXS.address]: [ETHEREUM.FRAX],
    [ETHEREUM.WBTC.address]: [ETHEREUM.RENBTC],
    [ETHEREUM.RENBTC.address]: [ETHEREUM.WBTC],
    [ETHEREUM.PONT.address]: [ETHEREUM.PWING],
    [ETHEREUM.PWING.address]: [ETHEREUM.PONT],
    [ETHEREUM.PLAY.address]: [ETHEREUM.DOUGH],
    [ETHEREUM.DOUGH.address]: [ETHEREUM.PLAY],
    [ETHEREUM.IBETH.address]: [ETHEREUM.ALPHA],
    [ETHEREUM.ALPHA.address]: [ETHEREUM.IBETH],
    [ETHEREUM.HBTC.address]: [ETHEREUM.CREAM],
    [ETHEREUM.CREAM.address]: [ETHEREUM.HBTC],
    [ETHEREUM.DUCK.address]: [ETHEREUM.USDP],
    [ETHEREUM.USDP.address]: [ETHEREUM.DUCK],
    [ETHEREUM.BAB.address]: [ETHEREUM.BAC],
    [ETHEREUM.BAC.address]: [ETHEREUM.BAB],
    [ETHEREUM.LIFT.address]: [ETHEREUM.LFBTC],
    [ETHEREUM.LFBTC.address]: [ETHEREUM.LIFT],
    [ETHEREUM.CVXCRV.address]: [ETHEREUM.CRV],
    [ETHEREUM.CRV.address]: [ETHEREUM.CVXCRV],
    [ETHEREUM.WOOFY.address]: [ETHEREUM.YFI],
    [ETHEREUM.SPANK.address]: [ETHEREUM.RAI],
    [ETHEREUM.DOLA.address]: [ETHEREUM.INV],
    [ETHEREUM.AGEUR.address]: [ETHEREUM.ANGLE],
  },
  [ChainId.MATIC]: {
    [MATIC.FRAX.address]: [MATIC.FXS],
    [MATIC.FXS.address]: [MATIC.FRAX],
    [MATIC.DRAX.address]: [MATIC.DMAGIC],
    [MATIC.AXMATIC.address]: [MATIC.DMAGIC],
    [MATIC.BCT.address]: [MATIC.KLIMA],
    [MATIC.KLIMA.address]: [MATIC.BCT],
    //[MATIC.DMAGIC.address]: [MATIC.DRAX, MATIC.AXMATIC],
  },
  [ChainId.ARBITRUM]: {
    [ARBITRUM.FRAX.address]: [ARBITRUM.FXS],
    [ARBITRUM.FXS.address]: [ARBITRUM.FRAX],
    [ARBITRUM.FLUID.address]: [ARBITRUM.DUSD],
  },
  [ChainId.MOONRIVER]: {
    [MOONRIVER.FRAX.address]: [MOONRIVER.FXS],
    [MOONRIVER.FXS.address]: [MOONRIVER.FRAX],
  },
  [ChainId.MOONBEAM]: {
    [MOONBEAM.FRAX.address]: [MOONBEAM.FXS],
    [MOONBEAM.FXS.address]: [MOONBEAM.FRAX],
  },
  [ChainId.HARMONY]: {
    [HARMONY.FRAX.address]: [HARMONY.FXS],
    [HARMONY.FXS.address]: [HARMONY.FRAX],
  },
  [ChainId.FANTOM]: {
    [FANTOM.FRAX.address]: [FANTOM.FXS],
    [FANTOM.FXS.address]: [FANTOM.FRAX],
  },
  [ChainId.BSC]: {
    [BSC.FRAX.address]: [BSC.FXS],
    [BSC.FXS.address]: [BSC.FRAX],
  },
  [ChainId.AVALANCHE]: {
    [AVALANCHE.FRAX.address]: [AVALANCHE.FXS],
    [AVALANCHE.FXS.address]: [AVALANCHE.FRAX],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.ETHEREUM]: {
    [ETHEREUM.AMPL.address]: [ETHEREUM.DAI, WNATIVE[ChainId.ETHEREUM]],
  },
  [ChainId.MATIC]: {
    [MATIC.TEL.address]: [MATIC.SUSHI, MATIC.AAVE],
  },
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.ETHEREUM],
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.SPELL,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.ICE,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.OHM_V2,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    ETHEREUM.STG,
  ],
  [ChainId.MATIC]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.MATIC],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.MATIC],
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.ICE,
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    MATIC.STG,
  ],
  [ChainId.FANTOM]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.FANTOM],
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.ICE,
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.SPELL,
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    FANTOM.STG,
  ],
  [ChainId.BSC]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.BSC],
    // @ts-ignore TYPE NEEDS FIXING
    BSC.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.BTCB,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.SPELL,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.ICE,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.USD,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    BSC.STG,
  ],
  [ChainId.ARBITRUM]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.ARBITRUM],
    // @ts-ignore TYPE NEEDS FIXING
    ARBITRUM.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    ARBITRUM.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    ARBITRUM.SPELL,
    // @ts-ignore TYPE NEEDS FIXING
    ARBITRUM.ICE,
    // @ts-ignore TYPE NEEDS FIXING
    ARBITRUM.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    ARBITRUM.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    ARBITRUM.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    ARBITRUM.STG,
  ],
  [ChainId.XDAI]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.XDAI],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.XDAI],
    // @ts-ignore TYPE NEEDS FIXING
    XDAI.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    XDAI.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    XDAI.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    XDAI.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    XDAI.GNO,
  ],
  [ChainId.AVALANCHE]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.AVALANCHE],
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.ICE,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.SPELL,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.WMEMO,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.STG,
  ],
  [ChainId.HARMONY]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.HARMONY],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.HARMONY],
    // @ts-ignore TYPE NEEDS FIXING
    HARMONY.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    HARMONY.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    HARMONY.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    HARMONY.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    HARMONY.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    HARMONY.FRAX,
  ],
  [ChainId.HECO]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.HECO],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.HECO],
    // @ts-ignore TYPE NEEDS FIXING
    HECO.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    HECO.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    HECO.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    HECO.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    HECO.DAI,
  ],
  [ChainId.OKEX]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.OKEX],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.OKEX],
    // @ts-ignore TYPE NEEDS FIXING
    OKEX.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    OKEX.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    OKEX.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    OKEX.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    OKEX.DAI,
  ],
  [ChainId.CELO]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.CELO],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.CELO],
    // @ts-ignore TYPE NEEDS FIXING
    CELO.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    CELO.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    CELO.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    CELO.cUSD,
    // @ts-ignore TYPE NEEDS FIXING
    CELO.cEURO,
  ],
  [ChainId.MOONRIVER]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONRIVER],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.MOONRIVER],
    // @ts-ignore TYPE NEEDS FIXING
    MOONRIVER.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    MOONRIVER.BTC,
    // @ts-ignore TYPE NEEDS FIXING
    MOONRIVER.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    MOONRIVER.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    MOONRIVER.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    MOONRIVER.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    MOONRIVER.ROME,
  ],
  [ChainId.PALM]: [...WRAPPED_NATIVE_ONLY[ChainId.PALM], PALM.WETH, PALM.DAI],
  [ChainId.FUSE]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.FUSE],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.FUSE],
    // @ts-ignore TYPE NEEDS FIXING
    FUSE.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    FUSE.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    FUSE.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    FUSE.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    FUSE.DAI,
  ],
  [ChainId.TELOS]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.TELOS],
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.TELOS],
    // @ts-ignore TYPE NEEDS FIXING
    TELOS.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    TELOS.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    TELOS.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    TELOS.USDT,
  ],
  [ChainId.MOONBEAM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONBEAM],
    MOONBEAM.USDC,
    MOONBEAM.USDT,
    MOONBEAM.UST,
    MOONBEAM.WETH,
    MOONBEAM.WBTC,
    MOONBEAM.FRAX,
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.DAI,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.WBTC,
    ETHEREUM.OHM_V1,
    ETHEREUM.OHM_V2,
    ETHEREUM.MIM,
    ETHEREUM.FRAX,
    ETHEREUM.STG,
  ],
  [ChainId.MATIC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MATIC],
    MATIC.USDC,
    MATIC.WBTC,
    MATIC.MIM,
    MATIC.DAI,
    MATIC.WETH,
    MATIC.USDT,
    MATIC.FRAX,
    MATIC.STG,
  ],
  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.DAI,
    FANTOM.USDC,
    FANTOM.WBTC,
    FANTOM.WETH,
    FANTOM.MIM,
    FANTOM.FRAX,
    FANTOM.STG,
  ],
  [ChainId.BSC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC],
    BSC.DAI,
    BSC.USD,
    BSC.USDC,
    BSC.USDT,
    BSC.BTCB,
    BSC.WETH,
    BSC.MIM,
    BSC.FRAX,
    BSC.STG,
  ],
  [ChainId.ARBITRUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM],
    ARBITRUM.WBTC,
    ARBITRUM.USDC,
    ARBITRUM.USDT,
    ARBITRUM.MIM,
    ARBITRUM.gOHM,
    ARBITRUM.MAGIC,
    ARBITRUM.FRAX,
    ARBITRUM.STG,
  ],
  [ChainId.XDAI]: [...WRAPPED_NATIVE_ONLY[ChainId.XDAI], XDAI.USDC, XDAI.USDT, XDAI.WBTC, XDAI.WETH],
  [ChainId.AVALANCHE]: [
    // @ts-ignore TYPE NEEDS FIXING
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE],
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.DAI,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.USDT,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.WBTC,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.WETH,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.USDC,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.MIM,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.TIME,
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.FRAX,
    // @ts-ignore TYPE NEEDS FIXING
    SUSHI[ChainId.AVALANCHE],
    // @ts-ignore TYPE NEEDS FIXING
    AVALANCHE.STG,
  ],
  [ChainId.HARMONY]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.HARMONY],
    HARMONY.DAI,
    HARMONY.USDC,
    HARMONY.USDT,
    HARMONY.WBTC,
    HARMONY.WETH,
    HARMONY.FRAX,
  ],
  [ChainId.HECO]: [...WRAPPED_NATIVE_ONLY[ChainId.HECO], HECO.DAI, HECO.USDC, HECO.USDT, HECO.WBTC, HECO.WETH],
  [ChainId.OKEX]: [...WRAPPED_NATIVE_ONLY[ChainId.OKEX], OKEX.DAI, OKEX.USDC, OKEX.USDT, OKEX.WBTC, OKEX.WETH],
  [ChainId.CELO]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.CELO],
    CELO.cETH,
    CELO.mCUSD,
    CELO.mCELO,
    CELO.mcEURO,
    CELO.cUSD,
    CELO.cEURO,
    CELO.cBTC,
  ],
  [ChainId.MOONRIVER]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONRIVER],
    MOONRIVER.USDC,
    MOONRIVER.USDT,
    MOONRIVER.WETH,
    MOONRIVER.FRAX,
    MOONRIVER.MIM,
    MOONRIVER.BTC,
    MOONRIVER.ROME,
  ],
  [ChainId.PALM]: [...WRAPPED_NATIVE_ONLY[ChainId.PALM], PALM.WETH, PALM.DAI],
  [ChainId.FUSE]: [...WRAPPED_NATIVE_ONLY[ChainId.FUSE], FUSE.USDC, FUSE.USDT, FUSE.WBTC, FUSE.WETH, FUSE.DAI],
  [ChainId.TELOS]: [...WRAPPED_NATIVE_ONLY[ChainId.TELOS], TELOS.USDC, TELOS.USDT, TELOS.WETH, TELOS.WBTC],
  [ChainId.MOONBEAM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONBEAM],
    MOONBEAM.USDC,
    MOONBEAM.USDT,
    MOONBEAM.UST,
    MOONBEAM.WETH,
    MOONBEAM.WBTC,
    MOONBEAM.FRAX,
  ],
}

export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [ChainId.ETHEREUM]: [
    // @ts-ignore TYPE NEEDS FIXING
    [SUSHI[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM]],
    [
      new Token(ChainId.ETHEREUM, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.ETHEREUM, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin'),
    ],
    [ETHEREUM.USDC, ETHEREUM.USDT],
    [ETHEREUM.DAI, ETHEREUM.USDT],
  ],
}
