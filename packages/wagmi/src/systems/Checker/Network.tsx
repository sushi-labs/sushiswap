'use client'

import { InformationCircleIcon } from '@heroicons/react/24/solid'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TooltipContent,
} from '@sushiswap/ui'
import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import { FC, ReactElement, ReactNode } from 'react'
import { chainName } from 'sushi/chain'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface NetworkProps extends ButtonProps {
  chainId: number | undefined
  hoverCardContent?: ReactNode | undefined
}

const Network: FC<NetworkProps> = ({
  chainId,
  fullWidth = true,
  size = 'xl',
  children,
  hoverCardContent,
  ...rest
}): ReactElement<any, any> | null => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  if (!chainId) return null

  const _chainId = Number(chainId)
  if (chain?.id !== _chainId)
    return !TooltipContent ? (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={() => switchNetwork?.(_chainId)}
        {...rest}
      >
        Switch to {chainName[_chainId]}
      </Button>
    ) : (
      <HoverCard openDelay={0} closeDelay={0}>
        <Button
          fullWidth={fullWidth}
          size={size}
          onClick={() => switchNetwork?.(_chainId)}
          {...rest}
        >
          Switch to {chainName[_chainId]}
          <HoverCardTrigger>
            <InformationCircleIcon width={16} height={16} />
          </HoverCardTrigger>
        </Button>
        <HoverCardContent className="max-w-[360px]">
          {hoverCardContent}
        </HoverCardContent>
      </HoverCard>
    )

  return <>{children}</>
}

export { Network, type NetworkProps }
