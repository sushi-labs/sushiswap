import { ChainId } from '@sushiswap/chain'
import { Address, useEnsAvatar } from 'wagmi'

export type Props = {
  address?: `0x${string}`
}

export function Avatar({ address }: Props): JSX.Element {
  const { data } = useEnsAvatar({
    address: address as Address,
    chainId: ChainId.ETHEREUM,
    enabled: !!address,
  })

  if (data) return <>{data}</>
  return <></>
}
