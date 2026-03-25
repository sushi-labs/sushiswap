import {
  Partners,
  getPartnerChains,
  TimeDuration,
  TimeUnit,
} from '@orbs-network/spot-react'
import { EvmChainId } from 'sushi/evm'

export const TWAP_MIN_FILL_DELAY = {
  value: 5,
  unit: TimeUnit.Minutes,
} as const satisfies TimeDuration

export const TWAP_MAX_FILL_DELAY = {
  value: 365,
  unit: TimeUnit.Days,
} as const satisfies TimeDuration

export const TWAP_SUPPORTED_CHAIN_IDS = getPartnerChains(
  Partners.Sushiswap,
) as EvmChainId[]
export const ORBS_EXPLORER_URL = 'https://orbs-explorer.vercel.app'
