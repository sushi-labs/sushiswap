import { ChainId } from '@sushiswap/chain'

import { Theme } from './types'

export const defaultTheme: Theme = {
  accent: '#0993EC',
  primary: {
    default: 'text-slate-200',
    hover: 'hover:text-slate-100',
  },
  secondary: {
    default: 'text-slate-400',
    hover: 'hover:text-slate-300',
  },
  borderRadius: 12,
  background: {
    primary: 'bg-slate-700',
    secondary: 'bg-slate-800',
  },
}

export const SUPPORTED_CHAIN_IDS = [
  // ChainId.ETHEREUM,
  // ChainId.BSC,
  // ChainId.AVALANCHE,
  // ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.AVALANCHE,
  ChainId.FANTOM,
  // ChainId.FANTOM,
  // TESTNETS
  // ChainId.POLYGON_TESTNET,
  // ChainId.RINKEBY,
  // ChainId.ROPSTEN,
  // ChainId.GÖRLI,
  // ChainId.KOVAN,
]

export const SUSHI_X_SWAP_ADDRESS: Record<number, string> = {
  [ChainId.AVALANCHE]: '0x5629CE74DdCAD7Cc72b3Ea30444dA7172AD851D9',
  [ChainId.FANTOM]: '0x5629CE74DdCAD7Cc72b3Ea30444dA7172AD851D9',
  [ChainId.ARBITRUM]: '0x1C4369df5732ccF317fef479B26A56e176B18ABb',
  [ChainId.OPTIMISM]: '0x8f54301F315C56c112D492D9443047D4745dbe9e',
}

export const CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS: Record<number, string> = {
  [ChainId.OPTIMISM]: '0x93395129bd3fcf49d95730D3C2737c17990fF328',
}
