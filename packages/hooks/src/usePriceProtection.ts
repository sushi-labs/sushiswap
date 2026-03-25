'use client'

import { useLocalStorage } from './useLocalStorage'

const PRICE_PROTECTION_STORAGE_KEY = 'price-protection-spot'
const DEFAULT_PRICE_PROTECTION = 'AUTO'

export const usePriceProtection = (defaultValue?: string) =>
  useLocalStorage(
    PRICE_PROTECTION_STORAGE_KEY,
    defaultValue ?? DEFAULT_PRICE_PROTECTION,
  )
