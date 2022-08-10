import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { JSBI } from '@sushiswap/math'
import { Loader, NetworkIcon, Tooltip, Typography } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'
import { useBalance, useNetwork } from 'wagmi'

export type Props = {
  address?: string
  supportedNetworks?: ChainId[]
  children?({ content, isLoading }: { content: ReactNode; isLoading: boolean }): ReactNode
}

export const Balance: FC<Props> = ({ address, supportedNetworks, children }) => {
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: !!address })

  const content = isLoading ? (
    <Loader />
  ) : isError ? (
    <Tooltip
      button={<ExclamationCircleIcon width={20} height={20} className="text-red" />}
      panel={
        <Typography variant="xs" className="text-center">
          An error occurred while trying
          <br /> to fetch your balance
        </Typography>
      }
    />
  ) : supportedNetworks && chain?.id && !supportedNetworks.includes(chain?.id) ? (
    <Tooltip
      button={<ExclamationCircleIcon width={20} height={20} className="text-red" />}
      panel={
        <Typography variant="xs" className="text-center">
          Unsupported Network
        </Typography>
      }
    />
  ) : (
    <Typography weight={500} className="flex gap-1 items-center text-slate-200" as="span">
      {chain?.id && <NetworkIcon type="naked" chainId={chain.id} width={24} height={24} className="-ml-1.5" />}
      <Typography weight={500} className="flex gap-1 items-baseline text-slate-200" as="span">
        {isMounted &&
          chain &&
          data &&
          Amount.fromRawAmount(Native.onChain(chain.id), JSBI.BigInt(data.value)).toSignificant(4)}
        <Typography weight={500} variant="sm" className="text-slate-500" as="span">
          {chain ? Native.onChain(chain.id)?.symbol : 'ETH'}
        </Typography>
      </Typography>
    </Typography>
  )

  if (typeof children === 'function') {
    return <>{children({ content, isLoading: isLoading || !(isMounted && chain && data) })}</>
  }

  return content
}
