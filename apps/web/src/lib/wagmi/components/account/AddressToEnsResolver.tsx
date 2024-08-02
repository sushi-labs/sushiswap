import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { ReactNode } from 'react'
import { ChainId } from 'sushi/chain'
import { useEnsName } from 'wagmi'

export type Props = Parameters<typeof useEnsName<PublicWagmiConfig>>[0] & {
  children:
    | ReactNode
    | ReactNode[]
    | ((payload: ReturnType<typeof useEnsName>) => JSX.Element)
}

export const AddressToEnsResolver = ({
  children,
  chainId = ChainId.ETHEREUM,
  ...props
}: Props): JSX.Element => {
  const result = useEnsName({ ...props, chainId })

  if (typeof children === 'function') {
    return children(result)
  }

  return <>{children}</>
}
