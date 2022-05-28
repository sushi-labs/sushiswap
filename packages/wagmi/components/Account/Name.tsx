import { ChainId } from '@sushiswap/chain'
import { useEnsName } from 'wagmi'

export type Props = {
  address?: string
  children({ name, isEns }: { name?: string; isEns: boolean }): JSX.Element
}

export function Name({ address, children }: Props): JSX.Element {
  const { data } = useEnsName({
    address,
    chainId: ChainId.ETHEREUM,
    enabled: !!address,
  })

  return children({ name: data ? data : address, isEns: !!data })
}
