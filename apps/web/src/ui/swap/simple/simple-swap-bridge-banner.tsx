'use client'

import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useLocalStorage } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { FC } from 'react'
import { ChainId, EvmChain } from 'sushi/chain'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

const BridgeInfo = {
  [ChainId.SKALE_EUROPA]: {
    url: 'https://portal.skale.space/bridge',
    background: (
      <video autoPlay muted loop className="absolute inset-0 -z-10">
        <source src="/skale-hero-video.mp4" type="video/mp4" />
      </video>
    ),
    textColor: 'text-white',
  },
  [ChainId.KATANA]: {
    url: 'https://app.katana.network', // TODO
    background: <div className="absolute inset-0 -z-10 bg-black/80" />,
    textColor: 'text-white',
  },
} as const

export const SimpleSwapBridgeBanner: FC<{ className?: string }> = ({
  className,
}) => {
  const [hideBanner, setHideBanner] = useLocalStorage(
    'hide-bridge-banner',
    false,
  )

  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()

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
                Bridge to {EvmChain.fromChainId(chainId)?.name}
              </span>
              <ArrowUpRightIcon width={20} height={20} />
            </div>
          </div>
          <span className="text-xs">
            Deposit your tokens to {EvmChain.fromChainId(chainId)?.name}.
          </span>
        </div>
      </div>
    </a>
  ) : null
}

export const KatanaBridgeBanner: FC<{ className?: string }> = ({
  className,
}) => {
  const [hideBanner, setHideBanner] = useLocalStorage(
    'hide-katana-bridge-banner',
    false,
  )

  return !hideBanner ? (
    <a
      href={'/'} // TODO
      target="_blank"
      rel="noopener noreferrer"
      className="text-white"
    >
      <div
        className={classNames(
          'rounded-xl relative p-6 bg-black/50 overflow-hidden',
          className,
        )}
      >
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
            <NetworkIcon
              type="naked"
              chainId={ChainId.KATANA}
              width={24}
              height={24}
            />
            <div className="flex items-center">
              <span className="font-semibold">Bridge to Katana</span>
              <ArrowUpRightIcon width={20} height={20} />
            </div>
          </div>
          <span className="text-xs">Move your tokens to swap.</span>
        </div>
      </div>
    </a>
  ) : null
}
