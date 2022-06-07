import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { Amount, Native } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { JSBI } from '@sushiswap/math'
import { Loader, NetworkIcon, Typography } from '@sushiswap/ui'
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
    <>
      <Typography weight={700} className="flex gap-1 items-center text-slate-200" as="span">
        {activeChain?.id && (
          <NetworkIcon type="naked" chainId={activeChain.id} width={24} height={24} className="-ml-1.5" />
        )}
        <Typography weight={700} className="flex gap-1 items-baseline text-slate-200" as="span">
          {isMounted &&
            activeChain &&
            data &&
            Amount.fromRawAmount(Native.onChain(activeChain.id), JSBI.BigInt(data.value)).toSignificant(4)}
          <Typography weight={700} variant="sm" className="text-slate-500" as="span">
            {activeChain ? Native.onChain(activeChain.id).symbol : 'ETH'}
          </Typography>
        </Typography>
      </Typography>
    </>
  )
}
