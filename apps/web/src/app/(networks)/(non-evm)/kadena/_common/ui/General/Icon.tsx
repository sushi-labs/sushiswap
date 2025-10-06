import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  cloudinaryLogoFetchLoader,
} from '@sushiswap/ui'
import { KadenaCircle } from '@sushiswap/ui/icons/network/circle/KadenaCircle'
import Image from 'next/image'
import { KINESIS_BRIDGE_EVM_KADENA } from '~kadena/_common/constants/token-list'
import type { KinesisToken } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'

type IconProps = {
  currency: KinesisToken | undefined
  height?: number
  width?: number
}

export const Icon = ({ currency, height = 40, width = 40 }: IconProps) => {
  if (
    currency?.address === 'coin' ||
    currency?.address?.toLowerCase() ===
      KINESIS_BRIDGE_EVM_KADENA.address.toLowerCase()
  ) {
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
        <Avatar style={{ width: width, height: height }}>
          <AvatarImage width={Number(width) ?? 20} src={''} />
          <AvatarFallback>{currency?.symbol?.substring(0, 2)}</AvatarFallback>
        </Avatar>
      )}
    </>
  )
}
