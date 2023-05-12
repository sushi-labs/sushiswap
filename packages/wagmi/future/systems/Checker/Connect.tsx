import { useIsMounted } from '@sushiswap/hooks'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { ConnectButton } from '../../components'
import { Button, ButtonProps } from '@sushiswap/ui/future/components/button'
import dynamic from 'next/dynamic'

export const Component: FC<ButtonProps<'button'>> = ({
  children,
  className,
  variant,
  fullWidth,
  size,
  name,
  onBlur,
  type,
}) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()

  if (isMounted && !address)
    return (
      <ConnectButton
        hideChevron={true}
        className={className}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        name={name}
        as={Button}
        onBlur={onBlur}
        type={type}
      >
        Connect Wallet
      </ConnectButton>
    )

  return <>{children}</>
}

export const Connect = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
