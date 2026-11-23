'use client'

import { getAvatarImageSource, getCurrencyIconSrc } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { Currency } from 'sushi'
import { getDominantImageColor } from '../get-dominant-image-color'

export function useCurrencyIconColor(
  currency: Currency | undefined,
): string | undefined {
  const src = currency && getCurrencyIconSrc(currency)
  const { data } = useQuery({
    queryKey: ['currency-icon-color', src],
    queryFn: async () => {
      if (!src) return null
      const { loader, fallbackSrc } = getAvatarImageSource(src)
      const color = await getDominantImageColor(
        loader ? loader({ src, width: 32 }) : src,
      )
      if (color || !fallbackSrc) return color
      return getDominantImageColor(fallbackSrc)
    },
    enabled: Boolean(src) && typeof document !== 'undefined',
    staleTime: Number.POSITIVE_INFINITY,
  })
  return data ?? undefined
}
