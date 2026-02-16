'use client'

import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useLocalStorage } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { FC } from 'react'
import { getChainById } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

const BridgeInfo = {
  [EvmChainId.SKALE_EUROPA]: {
    url: 'https://portal.skale.space/bridge',
    background: (
      <video autoPlay muted loop className="absolute inset-0 -z-10">
        <source src="/skale-hero-video.mp4" type="video/mp4" />
      </video>
    ),
    textColor: 'text-white',
  },
  [EvmChainId.KATANA]: {
    url: 'https://app.katana.network', // TODO
    background: (
      <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur" />
    ),
    textColor: 'text-white',
  },
} as const

export const SimpleSwapBridgeBanner: FC<{ className?: string }> = ({
  className,
}) => {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()

  const [hideBanner, setHideBanner] = useLocalStorage(
    `hide-bridge-banner-${chainId}`,
    false,
  )

  return chainId in BridgeInfo && !hideBanner ? (
    <a
      href={BridgeInfo[chainId as keyof typeof BridgeInfo].url}
      target="_blank"
      rel="noopener noreferrer"
      className={BridgeInfo[chainId as keyof typeof BridgeInfo].textColor}
    >
      <div
        className={classNames(
          'rounded-xl relative p-6 bg-blue/10 overflow-hidden',
          className,
        )}
      >
        {BridgeInfo[chainId as keyof typeof BridgeInfo].background}
        <XMarkIcon
          width={20}
          height={20}
          className={'absolute top-[10px] right-[10px] cursor-pointer'}
          onClick={(e) => {
            e.preventDefault()
            setHideBanner(true)
          }}
        />
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <NetworkIcon chainId={chainId} width={24} height={24} />
            <div className="flex items-center">
              <span className="font-semibold">
                Bridge to {getChainById(chainId).name}
              </span>
              <ArrowUpRightIcon width={20} height={20} />
            </div>
          </div>
          <span className="text-xs">
            Deposit your tokens to {getChainById(chainId).name}.
          </span>
        </div>
      </div>
    </a>
  ) : null
}
