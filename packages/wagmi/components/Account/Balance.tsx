import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { JSBI } from '@sushiswap/math'
import { Loader, NetworkIcon, Popover, Typography } from '@sushiswap/ui'
import { useBalance, useNetwork } from 'wagmi'

export type Props = {
  address?: string
  supportedNetworks?: ChainId[]
}

export function Balance({ address, supportedNetworks }: Props): JSX.Element {
  const { activeChain } = useNetwork()
  const isMounted = useIsMounted()
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: !!address })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <Popover
        hover
        arrow={false}
        button={<ExclamationCircleIcon width={20} height={20} className="text-red" />}
        panel={
          <Typography variant="xs" className="text-center bg-slate-700 rounded-lg px-3 py-2">
            An error occurred while trying
            <br /> to fetch your balance
          </Typography>
        }
      />
    )
  }

  if (supportedNetworks && activeChain?.id && !supportedNetworks.includes(activeChain?.id)) {
    return (
      <Popover
        hover
        arrow={false}
        button={<ExclamationCircleIcon width={20} height={20} className="text-red" />}
        panel={
          <Typography variant="xs" className="text-center bg-slate-700 rounded-lg px-3 py-2">
            Unsupported Network
          </Typography>
        }
      />
    )
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
            {activeChain ? Native.onChain(activeChain.id)?.symbol : 'ETH'}
          </Typography>
        </Typography>
      </Typography>
    </>
  )
}
