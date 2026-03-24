'use client'
import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { type ButtonHTMLAttributes, type FC, useMemo, useState } from 'react'
import { usePortfolio } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
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
    <Card className="p-2 !rounded-md gap-2 flex !bg-[#18223B] border-transparent flex-col w-full lg:min-w-[50%]">
      <div className="flex items-center justify-between gap-2  whitespace-nowrap text-xs lg:text-sm">
        <div className="flex items-center gap-4">
          {VIEWS.map((v) => (
            <ViewButton
              key={v.value}
              data-selected={(view.value === v.value).toString()}
              onClick={() => setView(v)}
            >
              {v.label}
            </ViewButton>
          ))}
        </div>
        <DropdownMenu open={openTime} onOpenChange={setOpenTime}>
          <DropdownMenuTrigger className="capitalize flex items-center">
            {time}{' '}
            <ChevronDownIcon
              className={classNames(
                'w-4 h-4 min-w-4 ml-1 transition-transform',
                openTime ? 'rotate-180' : '',
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="paper !rounded-md !bg-[#18223B]">
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
      {isLoading ? (
        <div>
          <SkeletonBox className="w-full h-[208px]" />
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading stats</div>
      ) : (
        <div>
          <DataChart data={dataToRender} />
        </div>
      )}
    </Card>
  )
}

const ViewButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      className={classNames(
        'flex gap-1 items-center text-xs lg:text-sm text-muted-foreground',
        'data-[selected=true]:text-white ',
        props.className,
      )}
      type="button"
    >
      {props.children}
    </button>
  )
}
