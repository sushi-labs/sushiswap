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
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: !!address })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <Popover
        hover
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

  if (supportedNetworks && chain?.id && !supportedNetworks.includes(chain?.id)) {
    return (
      <Popover
        hover
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
    <Typography weight={700} className="flex gap-1 items-center text-slate-200" as="span">
      {chain?.id && <NetworkIcon type="naked" chainId={chain.id} width={24} height={24} className="-ml-1.5" />}
      <Typography weight={700} className="flex gap-1 items-baseline text-slate-200" as="span">
        {isMounted &&
          chain &&
          data &&
          Amount.fromRawAmount(Native.onChain(chain.id), JSBI.BigInt(data.value)).toSignificant(4)}
        <Typography weight={700} variant="sm" className="text-slate-500" as="span">
          {chain ? Native.onChain(chain.id)?.symbol : 'ETH'}
        </Typography>
      </Typography>
    </Typography>
  )
}
