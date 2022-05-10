import { useEnsName } from 'wagmi'
import { shortenAddress } from '../../../format'

type Props = {
  address?: string
}

function Name({ address }: Props): JSX.Element {
  const { data } = useEnsName({
    address,
  })
  return <>{data || (address ? shortenAddress(address) : '')}</>
}

export default Name
