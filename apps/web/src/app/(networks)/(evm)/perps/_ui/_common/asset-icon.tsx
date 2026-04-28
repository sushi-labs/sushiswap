'use client'
import { classNames } from '@sushiswap/ui'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/UnknownTokenIcon'
import { useEffect, useMemo, useState } from 'react'
import { type PerpOrSpotAsset, getHyperliquidCoinIconUrl } from 'src/lib/perps'

export const AssetIcon = ({
  asset,
  size = 'default',
}: { asset?: PerpOrSpotAsset; size?: 'default' | 'sm' }) => {
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
          className={classNames(size === 'default' ? 'w-6 h-6' : 'w-4 h-4')}
        />
      ) : (
        <img
          src={url}
          alt={asset?.symbol}
          className={classNames(
            'rounded-full',
            size === 'default' ? 'w-6 h-6' : 'w-4 h-4',
          )}
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
