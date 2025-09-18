import { cloudinaryLogoFetchLoader } from '@sushiswap/ui'
import Image from 'next/image'
import type { Token } from '../../lib/types/token.type'

type IconProps = {
  currency: Token | undefined
  height?: number
  width?: number
}

// Simple hash function to generate consistent colors
const hashStringToColor = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 50%)`
}

export const TokenIcon = ({ currency, height = 40, width = 40 }: IconProps) => {
  return (
    <>
      {currency?.icon ? (
        <div
          style={{ width, height }}
          className="relative flex shrink-0 overflow-hidden rounded-full"
        >
          <Image
            loader={cloudinaryLogoFetchLoader}
            src={currency.icon}
            alt={currency.code}
            height={height}
            width={width}
            className="aspect-square h-full w-full"
          />
        </div>
      ) : (
        <div
          className="text-xs text-white font-bold rounded-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-gray-200 dark:from-blue-700 dark:to-blue-900"
          style={{
            width: `${width}px`,
            height: `${height}px`,
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
