'use client'
import { classNames } from '@sushiswap/ui'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/UnknownTokenIcon'
import { useEffect, useMemo, useState } from 'react'
import { type PerpOrSpotAsset, getHyperliquidCoinIconUrl } from 'src/lib/perps'

const sizes = {
  default: 'w-6 h-6',
  sm: 'w-4 h-4',
  xl: 'w-14 h-14',
}

export const AssetIcon = ({
  asset,
  size = 'default',
}: { asset?: PerpOrSpotAsset; size?: 'default' | 'sm' | 'xl' }) => {
  const [imageErr, setImageErr] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset imageErr on asset change
  useEffect(() => {
    setImageErr(false)
  }, [asset?.symbol])

  const url = useMemo(() => {
    return getHyperliquidCoinIconUrl(asset)
  }, [asset])

  return (
    <>
      {imageErr || !asset ? (
        <UnknownTokenIcon
          className={classNames(sizes[size], 'rounded-full w-')}
        />
      ) : (
        <img
          src={url}
          alt={asset?.symbol}
          className={classNames('rounded-full', sizes[size])}
          onLoadStart={() => {
            setImageErr(false)
          }}
          onError={() => {
            setImageErr(true)
          }}
        />
      )}
    </>
  )
}
