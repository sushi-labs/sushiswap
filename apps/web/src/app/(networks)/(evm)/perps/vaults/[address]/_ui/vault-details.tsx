import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from '@heroicons/react-v1/solid'
import type { PortfolioResponse } from '@nktkas/hyperliquid'
import { useCopyClipboard } from '@sushiswap/hooks'
import { Button, IconButton, SkeletonBox, classNames } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import {
  currencyFormatter,
  formatPerpsPercent,
  getTextColorClass,
} from 'src/lib/perps'
import { useVaultDetails } from 'src/lib/perps/info/use-vault-details'
import { useAccount } from 'src/lib/wallet'
import { formatPercent, truncateString } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { HoverItem, PerpsCard } from '~evm/perps/_ui/_common'
import type { Timeframe } from './vault-page'

const OPTIONS = ['about', 'vault-performance', 'your-performance'] as const

const calculateMaxDrawdown = (data: PortfolioResponse[1][1]) => {
  if (!data) return '0%'

  const pnl = data.pnlHistory.map(([_, value]) => Number(value))

  const acv = data.accountValueHistory.map(([_, value]) => Number(value))

  let maxDrawdown = 0

  for (let start = 0; start < pnl.length; start++) {
    if (acv[start] < 100) continue

    for (let end = start + 1; end < pnl.length; end++) {
      const drawdown = (pnl[end] - pnl[start]) / acv[start]

      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown
      }
    }
  }

  return formatPercent(
    Math.abs(maxDrawdown) === Number.POSITIVE_INFINITY
      ? 0
      : Math.abs(maxDrawdown),
  )
}
const getKey = (time: Timeframe) => {
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

export const VaultDetails = ({
  vaultAddress,
  timeframe,
}: { vaultAddress: EvmAddress; timeframe: Timeframe }) => {
  const address = useAccount('evm')
  const [isCopied, staticCopy] = useCopyClipboard()
  const [view, setView] = useState<(typeof OPTIONS)[number]>('about')
  const { data, isLoading } = useVaultDetails({ vaultAddress })

  const vaultPerformanceData = useMemo(() => {
    if (!data) return null
    const key = getKey(timeframe)
    const dataForKey = data?.portfolio.find(([d, _data]) => d === key)?.[1]
    if (!dataForKey) return null

    return {
      pnl: dataForKey?.pnlHistory?.[dataForKey.pnlHistory.length - 1]?.[1],
      volume: dataForKey?.vlm,
      maxDrawdown: calculateMaxDrawdown(dataForKey),
    }
  }, [data, timeframe])

  const userDrawdown = useMemo(() => {
    if (!data || !address) return null
    const pnlAllTime = Number(data?.followerState?.allTimePnl || 0)
    const pnlCurrent = Number(data?.followerState?.pnl || 0)
    const acv = Number(data?.followerState?.vaultEquity || 0)
    const drawdown = (pnlCurrent - pnlAllTime) / acv || 0
    return formatPercent(
      Math.abs(drawdown) === Number.POSITIVE_INFINITY ? 0 : Math.abs(drawdown),
    )
  }, [data, address])

  const content = useMemo(() => {
    switch (view) {
      case 'about':
        return (
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col">
              <p className="text-perps-muted-50">Leader</p>
              <div className="!text-perps-muted flex items-center gap-1 text-xs">
                <div>{truncateString(data?.leader || '', 10, 'middle')}</div>

                <IconButton
                  name="share"
                  size="xs"
                  icon={isCopied ? ClipboardCheckIcon : ClipboardCopyIcon}
                  onClick={() => staticCopy(data?.leader || '')}
                  variant="ghost"
                  className="!text-perps-muted-50"
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-perps-muted-50">Description</p>
              <div className="!text-perps-muted flex items-center gap-1 text-xs">
                {data?.description || 'No description provided.'}
              </div>
            </div>
          </div>
        )
      case 'vault-performance':
        return (
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center gap-2">
              <p className="text-perps-muted-50">PNL</p>
              <p
                className={classNames(
                  getTextColorClass(Number(vaultPerformanceData?.pnl || 0)),
                )}
              >
                {currencyFormatter.format(
                  Number(vaultPerformanceData?.pnl || 0),
                )}
              </p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <p className="text-perps-muted-50">Max Drawdown</p>
              <p className="text-perps-muted">
                {vaultPerformanceData?.maxDrawdown || '0%'}
              </p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <p className="text-perps-muted-50">Volume</p>
              <p className="text-perps-muted">
                {currencyFormatter.format(
                  Number(vaultPerformanceData?.volume || 0),
                )}
              </p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <HoverItem
                title="Profit Share"
                description={`The leader recieves a ${formatPerpsPercent(data?.leaderCommission || '0')} profit share.`}
              />
              <p className="text-perps-muted">
                {formatPerpsPercent(data?.leaderCommission || '0')}
              </p>
            </div>
          </div>
        )
      case 'your-performance':
        return (
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center gap-2">
              <p className="text-perps-muted-50">All-time PNL</p>
              <p
                className={classNames(
                  !address
                    ? ''
                    : getTextColorClass(
                        Number(data?.followerState?.allTimePnl || 0),
                      ),
                )}
              >
                {!address
                  ? 'N/A'
                  : currencyFormatter.format(
                      Number(data?.followerState?.allTimePnl || 0),
                    )}
              </p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <p className="text-perps-muted-50">Unrealized PNL</p>
              <p
                className={classNames(
                  !address
                    ? ''
                    : getTextColorClass(Number(data?.followerState?.pnl || 0)),
                )}
              >
                {!address
                  ? 'N/A'
                  : currencyFormatter.format(
                      Number(data?.followerState?.pnl || 0),
                    )}
              </p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <p className="text-perps-muted-50">Max Drawdown</p>
              <p className="text-perps-muted">
                {!address
                  ? vaultPerformanceData?.maxDrawdown || '0%'
                  : userDrawdown || '0%'}
              </p>
            </div>
          </div>
        )
    }
  }, [
    view,
    data,
    isCopied,
    staticCopy,
    vaultPerformanceData,
    address,
    userDrawdown,
  ])

  return (
    <PerpsCard className="p-3 gap-2 flex flex-col h-[260px]">
      <div className="w-fit">
        <PerpsCard
          className="flex items-center gap-1 hide-scrollbar overflow-x-auto p-0.5"
          rounded="full"
        >
          {OPTIONS.map((v) => (
            <Button
              key={v}
              size="xs"
              variant={v === view ? 'perps-secondary' : 'ghost'}
              onClick={() => setView(v)}
              className={classNames(
                'w-fit capitalize !text-xs !rounded-full !border-0',
                v === view ? 'text-white bg-accent' : 'text-muted-foreground',
              )}
            >
              {v?.replaceAll('-', ' ')}
            </Button>
          ))}
        </PerpsCard>
      </div>
      {isLoading ? <SkeletonBox className="w-full h-full" /> : content}
    </PerpsCard>
  )
}
