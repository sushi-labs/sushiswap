'use client'

import { useLocalStorage } from '@sushiswap/hooks'

const PRICE_PROTECTION_STORAGE_KEY = 'price-protection-spot'

/** Sentinel meaning "use the protocol default" (see DEFAULT_PRICE_PROTECTION_PERCENT). */
export const AUTO_PRICE_PROTECTION = 'AUTO'
/** Percentage applied when price protection is on AUTO / unset. */
export const DEFAULT_PRICE_PROTECTION_PERCENT = 3

export const usePriceProtection = (defaultValue?: string) =>
  useLocalStorage(
    PRICE_PROTECTION_STORAGE_KEY,
    defaultValue ?? AUTO_PRICE_PROTECTION,
  )
