'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import { useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import { NonStandardChainId } from 'src/config'

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
          'rounded-xl relative p-6 bg-[#E9E9EB] overflow-hidden',
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
              chainId={NonStandardChainId.KADENA}
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
        <Image
          src={'/kadena-bridge-banner-cube.svg'}
          alt="Kadena Bridge Banner Cube"
          width={119}
          height={119}
          className="absolute -translate-y-1/2 top-1/2 right-3"
        />
      </div>
    </Link>
  ) : null
}
