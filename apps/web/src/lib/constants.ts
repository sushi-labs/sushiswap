import { SushiSwapProtocol } from 'sushi'
import { SUSHI_DATA_API_HOST as PROD_SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'

export const SUSHI_DATA_API_HOST =
  process.env['SUSHI_DATA_API_HOST'] ||
  process.env['NEXT_PUBLIC_SUSHI_DATA_API_HOST'] ||
  PROD_SUSHI_DATA_API_HOST

export const PROTOCOL_MAP: Record<SushiSwapProtocol, string> = {
  SUSHISWAP_V3: 'SushiSwap V3',
  SUSHISWAP_V2: 'SushiSwap V2',
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
export const APPROVE_TAG_MIGRATE = 'APPROVE_TAG_MIGRATE'
export const APPROVE_TAG_XSWAP = 'APPROVE_TAG_XSWAP'
export const APPROVE_TAG_SWAP = 'APPROVE_TAG_SWAP'
export const APPROVE_TAG_STEER = 'APPROVE_TAG_STEER'
export const APPROVE_TAG_ZAP_LEGACY = 'APPROVE_TAG_ZAP_LEGACY'
export const APPROVE_TAG_ZAP_STEER = 'APPROVE_TAG_ZAP_STEER'

export const NativeAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
