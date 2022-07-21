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
  ChainId.ETHEREUM,
  ChainId.BSC,
  // ChainId.AVALANCHE,
  ChainId.POLYGON,
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

export const CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS: Record<number, string> = {
  [ChainId.OPTIMISM]: '0x93395129bd3fcf49d95730D3C2737c17990fF328',
  [ChainId.POLYGON]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288',
}
