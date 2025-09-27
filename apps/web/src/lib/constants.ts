import {
  SUSHI_DATA_API_HOST as PROD_SUSHI_DATA_API_HOST,
  SushiSwapProtocol,
} from 'sushi/evm'

export const SUSHI_DATA_API_HOST =
  process.env['SUSHI_DATA_API_HOST'] ||
  process.env['NEXT_PUBLIC_SUSHI_DATA_API_HOST'] ||
  PROD_SUSHI_DATA_API_HOST

export const SushiSwapCmsProtocols = [
  SushiSwapProtocol.SUSHISWAP_V3,
  SushiSwapProtocol.SUSHISWAP_V2,
]

export type SushiSwapCmsProtocol = (typeof SushiSwapCmsProtocols)[number]

export const PROTOCOL_MAP: Record<SushiSwapProtocol, string> = {
  SUSHISWAP_V3: 'SushiSwap V3',
  SUSHISWAP_V2: 'SushiSwap V2',
  BLADE: 'Blade',
} as const

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export const APPROVE_TAG_ADD_LEGACY = 'APPROVE_TAG_ADD_LEGACY'
export const APPROVE_TAG_REMOVE_LEGACY = 'APPROVE_TAG_REMOVE_LEGACY'
export const APPROVE_TAG_STAKE = 'APPROVE_TAG_STAKE'
export const APPROVE_TAG_UNSTAKE = 'APPROVE_TAG_UNSTAKE'
export const APPROVE_TAG_MIGRATE = 'APPROVE_TAG_MIGRATE'
export const APPROVE_TAG_XSWAP = 'APPROVE_TAG_XSWAP'
export const APPROVE_TAG_SWAP = 'APPROVE_TAG_SWAP'
export const APPROVE_TAG_ZAP_LEGACY = 'APPROVE_TAG_ZAP_LEGACY'

export const NativeAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const BLADE_API_HOST =
  process.env['BLADE_API_HOST'] ||
  process.env['NEXT_PUBLIC_BLADE_API_HOST'] ||
  'https://blade-api.sushi.com'

export const BLADE_API_KEY =
  process.env['BLADE_API_KEY'] || process.env['NEXT_PUBLIC_BLADE_API_KEY']
