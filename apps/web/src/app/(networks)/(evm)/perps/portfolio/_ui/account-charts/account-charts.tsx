'use client'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangle'
import { useMemo, useState } from 'react'
import { usePortfolio } from 'src/lib/perps'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { DataChart } from './data-chart'

const VIEWS = [
  {
    label: 'Account Value',
    value: 'accountValue' as const,
  },
  {
    label: 'PNL',
    value: 'pnl' as const,
  },
  {
    label: 'Perps PNL',
    value: 'perpsPnl' as const,
  },
]
const TIME = ['24h', '7D', '30D', 'All-time'] as const

const getKey = (
  time: (typeof TIME)[number],
  view: (typeof VIEWS)[number]['value'],
) => {
  if (view === 'perpsPnl') {
    switch (time) {
      case '24h':
        return 'perpDay' as const
      case '7D':
        return 'perpWeek' as const
      case '30D':
        return 'perpMonth' as const
      case 'All-time':
        return 'perpAllTime' as const
    }
  } else {
    switch (time) {
      case '24h':
        return 'day' as const
      case '7D':
        return 'week' as const
      case '30D':
        return 'month' as const
      case 'All-time':
        return 'allTime' as const
    }
  }
}

export const AccountCharts = () => {
  const [openTime, setOpenTime] = useState(false)
  const [view, setView] = useState<(typeof VIEWS)[number]>(VIEWS[1])
  const [time, setTime] = useState<(typeof TIME)[number]>(TIME[0])
  const address = useAccount('evm')
  const {
    data,
    isLoading: isLoadingPortfolio,
    error: portfolioError,
  } = usePortfolio({ address })

  const isLoading = isLoadingPortfolio
  const error = portfolioError

  const dataToRender = useMemo(() => {
    if (!data) return []
    const key = getKey(time, view.value)
    const dataForKey = data?.find(([d, _data]) => d === key)?.[1]
    if (view.value === 'perpsPnl' || view.value === 'pnl') {
      return dataForKey?.pnlHistory
    }
    return dataForKey?.accountValueHistory
  }, [data, time, view])

  return (
    <div className="w-full lg:!min-w-[50%]">
      <PerpsCard className="p-3 gap-2 flex flex-col" fullWidth>
        <div className="flex items-center justify-between gap-2 whitespace-nowrap text-xs lg:text-sm">
          <PerpsCard
            className="flex items-center gap-1 hide-scrollbar overflow-x-auto p-1"
            rounded="full"
          >
            {VIEWS.map((v) => (
              <Button
                key={v.value}
                size="xs"
                variant={v.value === view.value ? 'perps-secondary' : 'ghost'}
                onClick={() => setView(v)}
                className={classNames(
                  'w-full capitalize !text-xs !rounded-full  !border-0',
                  v.value === view.value
                    ? 'text-white bg-accent'
                    : 'text-muted-foreground',
                )}
              >
                {v.label}
              </Button>
            ))}
          </PerpsCard>
          <DropdownMenu open={openTime} onOpenChange={setOpenTime}>
            <DropdownMenuTrigger className="capitalize flex items-center text-perps-muted-50">
              {time}{' '}
              <DownTriangleIcon
                className={classNames(
                  'w-1.5 h-1.5 min-w-1.5 ml-1 transition-transform',
                  openTime ? 'rotate-180' : '',
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="paper !rounded-md !bg-black/10">
              {TIME.map((t) => (
                <DropdownMenuItem
                  key={t}
                  className="capitalize"
                  onClick={() => {
                    setTime(t)
                  }}
                >
                  {t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!address ? (
          <div className="flex items-center justify-center h-full min-h-[192px]">
            <ConnectButton namespace="evm" className="mx-auto" />
          </div>
        ) : isLoading ? (
          <div>
            <SkeletonBox className="w-full h-[192px]" />
          </div>
        ) : error ? (
          <div className="text-red-500">Error loading stats</div>
        ) : (
          <div>
            <DataChart data={dataToRender} />
          </div>
        )}
      </PerpsCard>
    </div>
  )
}
