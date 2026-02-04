'use client'

import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { createErrorToast } from '@sushiswap/notifications'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { Button, type ButtonProps } from '@sushiswap/ui'
import type { FC, ReactElement, ReactNode } from 'react'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import { useConnection, useSwitchChain } from 'wagmi'

interface NetworkProps extends ButtonProps {
  chainId: EvmChainId | undefined
  hoverCardContent?: ReactNode | undefined
  hideChainName?: boolean
}

const Network: FC<NetworkProps> = ({
  chainId,
  fullWidth = true,
  size = 'xl',
  children,
  hoverCardContent,
  hideChainName = false,
  ...rest
}): ReactElement<any, any> | null => {
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
