import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { ReactNode } from 'react'
import { ChainId } from 'sushi/chain'
import { useEnsAddress } from 'wagmi'

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
