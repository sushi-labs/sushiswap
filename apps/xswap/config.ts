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
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.POLYGON,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.OPTIMISM,
]

export const STABLE_POOL_FACTORY_ADDRESS: Record<number, string> = {
  [ChainId.POLYGON]: '0x2A0Caa28331bC6a18FF195f06694f90671dE70f2',
  [ChainId.OPTIMISM]: '0x827179dD56d07A7eeA32e3873493835da2866976',
}

export const CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS: Record<number, string> = {
  [ChainId.OPTIMISM]: '0x93395129bd3fcf49d95730D3C2737c17990fF328',
  [ChainId.POLYGON]: '0x28890e3C0aA9B4b48b1a716f46C9abc9B12abfab',
}
