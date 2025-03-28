'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import { useLocalStorage } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import { NonStandardChainId } from 'src/config'

export const SimpleSwapBridgeBanner: FC<{ className?: string }> = ({
  className,
}) => {
  const [hideBanner, setHideBanner] = useLocalStorage(
    'hide-bridge-banner-kadena',
    false,
  )

  return (
    <Link
      href={'#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`${hideBanner ? 'hidden' : ''}`}
    >
      <div
        className={classNames(
          'rounded-xl relative p-6 bg-blue/10 overflow-hidden',
          className,
        )}
      >
        <XMarkIcon
          width={20}
          height={20}
          className={'absolute top-[10px] z-10 right-[10px] cursor-pointer'}
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
            />
            <div className="flex items-center">
              <span className="font-semibold">Bridge to KADENA</span>
              <ArrowUpRightIcon width={20} height={20} />
            </div>
          </div>
          <span className="text-xs">Move your tokens to swap.</span>
        </div>
        <Image
          src={'/kadena-bridge-banner-cube.svg'}
          alt="Kadena Bridge Banner Cube"
          width={119}
          height={119}
          className="absolute top-1/2 -translate-y-1/2 right-3"
        />
      </div>
    </Link>
  )
}
