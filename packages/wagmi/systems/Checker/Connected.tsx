import { useIsMounted } from '@sushiswap/hooks'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { Wallet } from '../../components'
import { CheckerButton } from './types'

export const Connected: FC<CheckerButton> = ({ children, ...rest }) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()

  if (isMounted && !address)
    return (
      <Wallet.Button appearOnMount={false} {...rest}>
        Connect Wallet
      </Wallet.Button>
    )

  return <>{children}</>
}
