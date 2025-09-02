import type { JSX, ReactNode } from 'react'
import { EvmChainId } from 'sushi/evm'
import { useEnsName } from 'wagmi'
import type { PublicWagmiConfig } from '../../config/public'

export type Props = Parameters<typeof useEnsName<PublicWagmiConfig>>[0] & {
  children:
    | ReactNode
    | ReactNode[]
    | ((
        payload: ReturnType<typeof useEnsName<PublicWagmiConfig>>,
      ) => JSX.Element)
}

export const AddressToEnsResolver = ({
  children,
  chainId = EvmChainId.ETHEREUM,
  ...props
}: Props): JSX.Element => {
  const result = useEnsName({ ...props, chainId })

  if (typeof children === 'function') {
    return children(result)
  }

  return <>{children}</>
}
