'use client'

import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { createErrorToast } from '@sushiswap/notifications'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { Button, type ButtonProps } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { type EvmChainId, getEvmChainById, isEvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import { useConnection, useSwitchChain } from 'wagmi'

interface NetworkProps<TChainId extends EvmChainId | SvmChainId>
  extends ButtonProps {
  chainId: TChainId | undefined
  hoverCardContent?: ReactNode | undefined
  hideChainName?: boolean
}

function Network<TChainId extends EvmChainId | SvmChainId>(
  props: NetworkProps<TChainId>,
) {
  const { chainId, children } = props

  if (!chainId) return null

  return isEvmChainId(chainId) ? (
    <EvmNetwork {...(props as NetworkProps<EvmChainId>)} />
  ) : (
    <>{children}</>
  )
}

function EvmNetwork({
  chainId,
  fullWidth = true,
  size = 'xl',
  children,
  hoverCardContent,
  hideChainName = false,
  ...rest
}: NetworkProps<EvmChainId>) {
  const { chain } = useConnection()
  const { mutateAsync: switchChainAsync } = useSwitchChain({
    mutation: {
      onError: (e) => {
        createErrorToast(e.message, false)
      },
    },
  })

  if (!chainId) return null

  if (chain?.id !== chainId) {
    return !hoverCardContent ? (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={async () => {
          await switchChainAsync?.({ chainId })
        }}
        testId={`switch-network-${chainId}`}
        {...rest}
      >
        {hideChainName
          ? 'Switch Network'
          : `Switch to ${getEvmChainById(chainId).name}`}
      </Button>
    ) : (
      <HoverCard openDelay={0} closeDelay={0}>
        <Button
          fullWidth={fullWidth}
          size={size}
          onClick={async () => await switchChainAsync?.({ chainId })}
          testId={`switch-network-${chainId}`}
          {...rest}
        >
          {hideChainName
            ? 'Switch Network'
            : `Switch to ${getEvmChainById(chainId).name}`}
          <HoverCardTrigger>
            <InformationCircleIcon width={16} height={16} />
          </HoverCardTrigger>
        </Button>
        <HoverCardContent className="max-w-[360px]">
          {hoverCardContent}
        </HoverCardContent>
      </HoverCard>
    )
  }

  return <>{children}</>
}

export { Network, type NetworkProps }
