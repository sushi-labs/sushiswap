import { useEnsName } from 'wagmi'
import { shortenAddress } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'

type Props = {
  address?: string
}

function Name({ address }: Props): JSX.Element {
  const { data } = useEnsName({
    address,
  })

  return (
    <Typography variant="sm" weight={700} className="text-white tracking-wide">
      {data || (address ? shortenAddress(address) : '')}
    </Typography>
  )
}

export default Name
