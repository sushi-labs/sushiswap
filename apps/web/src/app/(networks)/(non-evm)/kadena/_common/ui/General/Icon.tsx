import { cloudinaryLogoFetchLoader } from '@sushiswap/ui'
import { KadenaCircle } from '@sushiswap/ui/icons/network/circle/KadenaCircle'
import Image from 'next/image'
import { hashStringToColor } from '~kadena/_common/lib/utils/formatters'
import type { KadenaToken } from '~kadena/_common/types/token-type'

type IconProps = {
  currency: KadenaToken | undefined
  height?: number
  width?: number
  fontSize?: number
}

export const Icon = ({
  currency,
  height = 40,
  width = 40,
  fontSize = 12,
}: IconProps) => {
  if (currency?.tokenAddress === 'coin') {
    return <KadenaCircle height={height} width={width} />
  }

  return (
    <>
      {currency?.tokenImage ? (
        <div
          style={{ width, height }}
          className="relative flex overflow-hidden rounded-full shrink-0"
        >
          <Image
            loader={cloudinaryLogoFetchLoader}
            // @TODO: need this to render local images, remove when we have a CDN
            unoptimized
            src={currency.tokenImage}
            alt={currency.tokenSymbol ?? currency.tokenName ?? ''}
            height={height}
            width={width}
            className="w-full h-full aspect-square"
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center text-xs font-bold text-white uppercase rounded-full bg-gradient-to-b from-gray-300 to-gray-200 dark:from-blue-700 dark:to-blue-900"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            background: hashStringToColor(
              currency ? `${currency.tokenSymbol} ${currency.tokenName}` : '??',
            ),
            fontSize: `${fontSize}px`,
          }}
        >
          {currency?.tokenSymbol?.substring(0, 2) ?? '??'}
        </div>
      )}
    </>
  )
}
