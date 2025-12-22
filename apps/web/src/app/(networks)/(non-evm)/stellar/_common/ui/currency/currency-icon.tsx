import { cloudinaryLogoFetchLoader } from '@sushiswap/ui'
import Image from 'next/image'
import React from 'react'
import type { Token } from '~stellar/_common/lib/types/token.type'

interface CurrencyIconProps {
  currency: Token | undefined
  height?: number
  width?: number
}

function djb2(str: string) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i) /* hash * 33 + c */
  }
  return hash
}

function hashStringToColor(str: string) {
  const hash = djb2(str)
  const r = (hash & 0xff0000) >> 16
  const g = (hash & 0x00ff00) >> 8
  const b = hash & 0x0000ff

  return `#${`0${r.toString(16)}`.substr(-2)}${`0${g.toString(16)}`.substr(-2)}${`0${b.toString(16)}`.substr(-2)}`
}

export const CurrencyIcon = ({
  currency,
  height = 40,
  width = 40,
}: CurrencyIconProps) => {
  return (
    <>
      {currency?.icon ? (
        <div
          style={{ width, height, minWidth: width, minHeight: height }}
          className="relative flex shrink-0 overflow-hidden rounded-full"
        >
          <Image
            loader={cloudinaryLogoFetchLoader}
            src={currency.icon}
            alt={currency.code || ''}
            height={height}
            width={width}
            className="object-cover rounded-full"
            style={{ width, height }}
          />
        </div>
      ) : (
        <div
          className="text-xs text-white font-bold rounded-full flex items-center justify-center shrink-0 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-blue-700 dark:to-blue-900"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            minWidth: `${width}px`,
            minHeight: `${height}px`,
            background: hashStringToColor(
              currency ? `${currency.code} ${currency.name}` : '??',
            ),
          }}
        >
          {currency?.code?.substring(0, 2) ?? '??'}
        </div>
      )}
    </>
  )
}
