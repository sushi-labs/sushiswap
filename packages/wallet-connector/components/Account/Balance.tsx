import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { Amount, Native } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Loader, Typography } from '@sushiswap/ui'
import { useBalance, useNetwork } from 'wagmi'

export type Props = {
  address?: string
}

export function Balance({ address }: Props): JSX.Element {
  const { activeChain } = useNetwork()
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: true })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <ExclamationCircleIcon width={20} height={20} className="cursor-pointer text-red" />
  }

  return (
    <Typography weight={700} className="flex gap-1 text-slate-200" component="span">
      <>
        {activeChain &&
          data &&
          Amount.fromRawAmount(Native.onChain(activeChain.id), JSBI.BigInt(data.value)).toSignificant(4)}
      </>
      <Typography weight={700} variant="sm" className="text-slate-500" component="span">
        ETH
      </Typography>
    </Typography>
  )
}
