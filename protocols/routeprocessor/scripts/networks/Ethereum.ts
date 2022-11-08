import {EthereumTokens} from './EthereumTokens'
import { ChainId, Network } from './Network'

export const ETHEREUM: Network = {
  name: 'ETHEREUM',
  chainId: ChainId.ETHEREUM,
  alchemyProviderArgs: ["homestead", process.env.ALCHEMY_API_KEY],
  tokens: EthereumTokens,
  baseWrappedToken: EthereumTokens.WETH9,
  baseTokenSymbol: 'ETH',
  BASES_TO_CHECK_TRADES_AGAINST: [
    EthereumTokens.WETH9,
    EthereumTokens.DAI,
    EthereumTokens.USDC,
    EthereumTokens.USDT,
    EthereumTokens.WBTC,
    EthereumTokens.RUNE,
    EthereumTokens.NFTX,
    EthereumTokens.STETH,
    EthereumTokens.OHM_V1,
    EthereumTokens.OHM_V2,
    EthereumTokens.MIM,
    EthereumTokens.FRAX,
    EthereumTokens.SUSHI,
    EthereumTokens.STG
  ],
  ADDITIONAL_BASES: {
    [EthereumTokens.UST.address]: [EthereumTokens.MIR],
    [EthereumTokens.MIR.address]: [EthereumTokens.UST],
    '0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84': [EthereumTokens.MIR, EthereumTokens.UST], // mAAPL
    '0x59A921Db27Dd6d4d974745B7FfC5c33932653442': [EthereumTokens.MIR, EthereumTokens.UST], // mGOOGL
    '0x21cA39943E91d704678F5D00b6616650F066fD63': [EthereumTokens.MIR, EthereumTokens.UST], // mTSLA
    '0xC8d674114bac90148d11D3C1d33C61835a0F9DCD': [EthereumTokens.MIR, EthereumTokens.UST], // mNFLX
    '0x13B02c8dE71680e71F0820c996E4bE43c2F57d15': [EthereumTokens.MIR, EthereumTokens.UST], // mQQQ
    '0xEdb0414627E6f1e3F082DE65cD4F9C693D78CCA9': [EthereumTokens.MIR, EthereumTokens.UST], // mTWTR
    '0x41BbEDd7286dAab5910a1f15d12CBda839852BD7': [EthereumTokens.MIR, EthereumTokens.UST], // mMSFT
    '0x0cae9e4d663793c2a2A0b211c1Cf4bBca2B9cAa7': [EthereumTokens.MIR, EthereumTokens.UST], // mAMZN
    '0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72': [EthereumTokens.MIR, EthereumTokens.UST], // mBABA
    '0x1d350417d9787E000cc1b95d70E9536DcD91F373': [EthereumTokens.MIR, EthereumTokens.UST], // mIAU
    '0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676': [EthereumTokens.MIR, EthereumTokens.UST], // mSLV
    '0x31c63146a635EB7465e5853020b39713AC356991': [EthereumTokens.MIR, EthereumTokens.UST], // mUSO
    '0xf72FCd9DCF0190923Fadd44811E240Ef4533fc86': [EthereumTokens.MIR, EthereumTokens.UST], // mVIXY
    '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [EthereumTokens.ETH2X_FLI],
    [EthereumTokens.FEI.address]: [EthereumTokens.DPI],
    [EthereumTokens.FRAX.address]: [EthereumTokens.FXS],
    [EthereumTokens.FXS.address]: [EthereumTokens.FRAX],
    [EthereumTokens.WBTC.address]: [EthereumTokens.RENBTC],
    [EthereumTokens.RENBTC.address]: [EthereumTokens.WBTC],
    [EthereumTokens.PONT.address]: [EthereumTokens.PWING],
    [EthereumTokens.PWING.address]: [EthereumTokens.PONT],
    [EthereumTokens.PLAY.address]: [EthereumTokens.DOUGH],
    [EthereumTokens.DOUGH.address]: [EthereumTokens.PLAY],
    [EthereumTokens.IBETH.address]: [EthereumTokens.ALPHA],
    [EthereumTokens.ALPHA.address]: [EthereumTokens.IBETH],
    [EthereumTokens.HBTC.address]: [EthereumTokens.CREAM],
    [EthereumTokens.CREAM.address]: [EthereumTokens.HBTC],
    [EthereumTokens.DUCK.address]: [EthereumTokens.USDP],
    [EthereumTokens.USDP.address]: [EthereumTokens.DUCK],
    [EthereumTokens.BAB.address]: [EthereumTokens.BAC],
    [EthereumTokens.BAC.address]: [EthereumTokens.BAB],
    [EthereumTokens.LIFT.address]: [EthereumTokens.LFBTC],
    [EthereumTokens.LFBTC.address]: [EthereumTokens.LIFT],
    [EthereumTokens.CVXCRV.address]: [EthereumTokens.CRV],
    [EthereumTokens.CRV.address]: [EthereumTokens.CVXCRV],
    [EthereumTokens.WOOFY.address]: [EthereumTokens.YFI],
    [EthereumTokens.SPANK.address]: [EthereumTokens.RAI],
    [EthereumTokens.DOLA.address]: [EthereumTokens.INV],
    [EthereumTokens.AGEUR.address]: [EthereumTokens.ANGLE],
  }
}