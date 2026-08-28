import {
  getTokenFallbackIconStyle,
  getTokenFallbackMonogram,
} from '@sushiswap/ui'
import React from 'react'
import type { Token } from '~aptos/_common/lib/types/token'

interface CurrencyIcon {
  currency: Token | undefined
  height?: number
  width?: number
}

export const CurrencyIcon = ({
  currency,
  height = 40,
  width = 40,
}: CurrencyIcon) => {
  return (
    <>
      {currency?.logoURI ? (
        <img
          src={currency?.logoURI}
          alt=""
          className="rounded-full"
          height={height}
          width={width}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            ...getTokenFallbackIconStyle(
              { address: currency?.address ?? '??', chainId: 'aptos' },
              width,
            ),
          }}
        >
          {getTokenFallbackMonogram(currency?.symbol)}
        </div>
      )}
    </>
  )
}
