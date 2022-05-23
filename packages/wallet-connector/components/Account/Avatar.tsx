import { ChainId } from '@sushiswap/chain'
import { useEnsAvatar, useNetwork } from 'wagmi'

export type Props = {
  address?: string
}

export function Avatar({ address }: Props): JSX.Element {
  const { activeChain } = useNetwork()
  const { data } = useEnsAvatar({
    addressOrName: address,
    enabled: activeChain?.id === ChainId.ETHEREUM,
  })

  if (data) return <>{data}</>
  return <></>
}
