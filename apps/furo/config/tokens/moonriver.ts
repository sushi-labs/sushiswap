import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.MOONRIVER, '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MOONRIVER, '0xB44a9B6905aF7c801311e8F4E76932ee959c663C', 6, 'USDT', 'Tether USD')
export const WETH = new Token(
  ChainId.MOONRIVER,
  '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
  18,
  'WETH',
  'Wrapped Ether'
)
export const MIM = new Token(
  ChainId.MOONRIVER,
  '0x0caE51e1032e8461f4806e26332c030E34De3aDb',
  18,
  'MIM',
  'Magic Internet Money'
)
export const BTC = new Token(
  ChainId.MOONRIVER,
  '0xE6a991Ffa8CfE62B0bf6BF72959A3d4f11B2E0f5',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)
export const ROME = new Token(ChainId.MOONRIVER, '0x4a436073552044D5f2f49B176853ad3Ad473d9d6', 9, 'ROME', 'Rome')
export const FRAX = new Token(ChainId.MOONRIVER, '0x1A93B23281CC1CDE4C4741353F3064709A16197d', 18, 'FRAX', 'Frax')
export const FXS = new Token(ChainId.MOONRIVER, '0x6f1D1Ee50846Fcbc3de91723E61cb68CFa6D0E98', 18, 'FXS', 'Frax Share')
