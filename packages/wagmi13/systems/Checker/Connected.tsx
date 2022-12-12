import { useIsMounted } from '@sushiswap/hooks'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { Wallet } from '../../components'
import { CheckerButton } from './types'

export const Connected: FC<CheckerButton> = ({ children, className, variant, fullWidth, size, name, onBlur, as }) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()

  if (isMounted && !address)
    return (
      <Wallet.Button
        appearOnMount={false}
        className={className}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        name={name}
        as={as}
        onBlur={onBlur}
      >
        Connect Wallet
      </Wallet.Button>
    )

  return <>{children}</>
}
