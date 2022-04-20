import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin')
export const WBTC = new Token(
  ChainId.FANTOM,
  '0x321162Cd933E2Be498Cd2267a90534A804051b11',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)
export const DAI = new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin')
export const WETH = new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether')
export const MIM = new Token(
  ChainId.FANTOM,
  '0x82f0B8B456c1A451378467398982d4834b6829c1',
  18,
  'MIM',
  'Magic Internet Money'
)
export const ICE = new Token(ChainId.FANTOM, '0xf16e81dce15B08F326220742020379B855B87DF9', 18, 'ICE', 'IceToken')
export const SPELL = new Token(ChainId.FANTOM, '0x468003B688943977e6130F4F68F23aad939a1040', 18, 'SPELL', 'SpellToken')
export const FRAX = new Token(ChainId.FANTOM, '0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355', 18, 'FRAX', 'Frax')
export const FXS = new Token(ChainId.FANTOM, '0x7d016eec9c25232b01F23EF992D98ca97fc2AF5a', 18, 'FXS', 'Frax Share')
export const STG = new Token(ChainId.FANTOM, '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590', 18, 'STG', 'StargateToken')
