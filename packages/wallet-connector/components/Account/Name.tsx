import { useEnsName } from 'wagmi'
import { shortenAddress } from '@sushiswap/format'
import { classNames, Typography } from '@sushiswap/ui'

type Props = {
  address?: string
  className?: string
}

function Name({ address, className }: Props): JSX.Element {
  const { data } = useEnsName({
    address,
  })

  return (
    <Typography variant="sm" weight={700} className={classNames('text-slate-50 tracking-wide', className)}>
      {!!data ? data : address ? shortenAddress(address) : ''}
    </Typography>
  )
}

export default Name
