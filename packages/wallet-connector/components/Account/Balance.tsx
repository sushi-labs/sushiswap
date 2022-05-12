import { useBalance, useNetwork } from 'wagmi'
import Loader from '@sushiswap/ui/loader/Loader'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { Typography } from '@sushiswap/ui'
import { Amount, Native } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'

type Props = {
  address?: string
}

function Balance({ address }: Props): JSX.Element {
  const { activeChain } = useNetwork()
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: true })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <ExclamationCircleIcon width={20} height={20} className="text-red cursor-pointer" />
  }

  return (
    <Typography weight={700} className="text-high-emphesis flex gap-1" component="span">
      <>
        {activeChain &&
          data &&
          Amount.fromRawAmount(Native.onChain(activeChain.id), JSBI.BigInt(data.value)).toSignificant(4)}
      </>
      <Typography weight={700} variant="sm" className="text-secondary" component="span">
        ETH
      </Typography>
    </Typography>
  )
}

export default Balance
