import { ReactNode } from 'react'
import { ChainId } from 'sushi/chain'
import { useEnsAddress } from 'wagmi'
import { PublicWagmiConfig } from '../../config/public'

export type Props = Parameters<typeof useEnsAddress<PublicWagmiConfig>>[0] & {
  children:
    | ReactNode
    | ReactNode[]
    | ((payload: ReturnType<typeof useEnsAddress>) => JSX.Element)
}

export const EnsToAddressResolver = ({
  children,
  chainId = ChainId.ETHEREUM,
  ...props
}: Props): JSX.Element => {
  const result = useEnsAddress({ ...props, chainId })

  if (typeof children === 'function') {
    return children(result)
  }

  return <>{children}</>
}
