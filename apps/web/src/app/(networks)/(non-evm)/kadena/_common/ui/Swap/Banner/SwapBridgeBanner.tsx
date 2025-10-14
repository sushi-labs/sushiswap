'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import { useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { KadenaBridgeCubeIcon } from '@sushiswap/ui/icons/KadenaBridgeCubeIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import Link from 'next/link'
import type { FC } from 'react'
import { ChainId } from 'sushi'

export const SimpleSwapBridgeBanner: FC<{ className?: string }> = ({
  className,
}) => {
  const isMounted = useIsMounted()
  const [hideBanner, setHideBanner] = useLocalStorage(
    'hide-bridge-banner-kadena',
    false,
  )

  return !hideBanner && isMounted ? (
    <Link
      href={'https://kinesisbridge.xyz/bridge'}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className={classNames(
          'rounded-xl flex items-center justify-between relative p-6 bg-[#E9E9EB] overflow-hidden',
          className,
        )}
      >
        <XMarkIcon
          width={20}
          height={20}
          className={
            'absolute text-black top-[10px] z-10 right-[10px] cursor-pointer'
          }
          onClick={(e) => {
            e.preventDefault()
            setHideBanner(true)
          }}
        />
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <NetworkIcon
              chainId={ChainId.KADENA}
              width={24}
              height={24}
              type="naked"
            />
            <div className="flex items-center text-black">
              <span className="font-semibold">Bridge to Kadena</span>
              <ArrowUpRightIcon width={20} height={20} className="text-black" />
            </div>
          </div>
          <span className="text-xs text-black">
            Move your tokens to Kadena to swap.
          </span>
        </div>
        <KadenaBridgeCubeIcon width={119} height={119} />
      </div>
    </Link>
  ) : null
}
