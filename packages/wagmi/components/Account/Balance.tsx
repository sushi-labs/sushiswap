import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { Amount, Native } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { JSBI } from '@sushiswap/math'
import { Loader, Typography } from '@sushiswap/ui'
import { useBalance, useNetwork } from 'wagmi'

export type Props = {
  address?: string
}

export function Balance({ address }: Props): JSX.Element {
  const { activeChain } = useNetwork()
  const isMounted = useIsMounted()
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: !!address })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <ExclamationCircleIcon width={20} height={20} className="cursor-pointer text-red" />
  }

  return (
    <Typography weight={700} className="flex gap-1 text-slate-200" as="span">
      {isMounted &&
        activeChain &&
        data &&
        Amount.fromRawAmount(Native.onChain(activeChain.id), JSBI.BigInt(data.value)).toSignificant(4)}
      <Typography weight={700} variant="sm" className="text-slate-500" as="span">
        ETH
      </Typography>
    </Typography>
  )
}
