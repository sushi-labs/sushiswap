import { ChainId } from '@sushiswap/chain'
import { useEnsAvatar } from 'wagmi'

export type Props = {
  address?: string
}

export function Avatar({ address }: Props): JSX.Element {
  const { data } = useEnsAvatar({
    addressOrName: address,
    chainId: ChainId.ETHEREUM,
    enabled: !!address,
  })

  if (data) return <>{data}</>
  return <></>
}
