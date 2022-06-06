import { ChainId } from '@sushiswap/chain'
import { ReactNode, useEffect } from 'react'
import { useEnsAddress } from 'wagmi'
import { UseEnsAddressArgs, UseEnsAddressConfig } from 'wagmi/dist/declarations/src/hooks/ens/useEnsAddress'

export type Props = UseEnsAddressArgs &
  UseEnsAddressConfig & {
    children: ReactNode | Array<ReactNode> | ((payload: ReturnType<typeof useEnsAddress>) => JSX.Element)
  }

export const EnsToAddressResolver = ({
  children,
  onSuccess,
  chainId = ChainId.ETHEREUM,
  ...props
}: Props): JSX.Element => {
  const result = useEnsAddress({ ...props, chainId })

  // Custom onSuccess callback to send success data with resolved result
  useEffect(() => {
    if (result.data && onSuccess) onSuccess(result.data)
  }, [result.data])

  if (typeof children === 'function') {
    return children(result)
  }

  return <>{children}</>
}
