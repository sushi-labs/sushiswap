import { cloudinaryLogoFetchLoader } from '@sushiswap/ui'
import { KadenaCircle } from '@sushiswap/ui/icons/network/circle/KadenaCircle'
import Image from 'next/image'
import type { KvmToken } from 'sushi/kvm'
import { hashStringToColor } from '~kadena/_common/lib/utils/formatters'

type IconProps = {
  currency: KvmToken | undefined
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
  if (currency?.address === 'coin') {
    return <KadenaCircle height={height} width={width} />
  }

  return (
    <>
      {currency?.metadata?.imageUrl ? (
        <div
          style={{ width, height }}
          className="relative flex overflow-hidden rounded-full shrink-0"
        >
          <Image
            loader={cloudinaryLogoFetchLoader}
            // @TODO: need this to render local images, remove when we have a CDN
            unoptimized
            src={currency?.metadata?.imageUrl as string}
            alt={currency.symbol ?? currency.name ?? ''}
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
              currency ? `${currency.symbol} ${currency.name}` : '??',
            ),
            fontSize: `${fontSize}px`,
          }}
        >
          {currency?.symbol?.substring(0, 2) ?? '??'}
        </div>
      )}
    </>
  )
}
