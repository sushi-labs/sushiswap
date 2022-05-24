import { useEnsAvatar, useNetwork } from 'wagmi'
import { ChainId } from '@sushiswap/chain'

type Props = {
  address?: string
}

function Avatar({ address }: Props): JSX.Element {
  const { activeChain } = useNetwork()
  const { data } = useEnsAvatar({
    addressOrName: address,
    enabled: activeChain?.id === ChainId.ETHEREUM,
  })

  if (data) return <>{data}</>
  return <></>
}

export default Avatar
