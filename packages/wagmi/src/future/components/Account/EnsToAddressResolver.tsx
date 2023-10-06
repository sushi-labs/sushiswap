import { ChainId } from 'sushi/chain'
import { ReactNode, useEffect } from 'react'
import { useEnsAddress } from 'wagmi'

export type Props = Parameters<typeof useEnsAddress>[0] & {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data])

  if (typeof children === 'function') {
    return children(result)
  }

  return <>{children}</>
}
