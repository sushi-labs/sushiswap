'use client'
import type { PortfolioResponse } from '@nktkas/hyperliquid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangleIcon'
import { useMemo, useState } from 'react'
import {
  currencyFormatter,
  getTextColorClass,
  useBorrowLendUserState,
  usePortfolio,
  useUserAccountValues,
  useUserVaultEquities,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatPercent } from 'sushi'
import { PerpsCard, StatItem } from '~evm/perps/_ui/_common'
import { useUserSettingsState } from '~evm/perps/_ui/account-management'

const STAT_VIEWS = ['perps + spot + vaults', 'perps'] as const
const TIME = ['24h', '7D', '30D', 'All-time'] as const

const getKey = (
  time: (typeof TIME)[number],
  view: (typeof STAT_VIEWS)[number],
) => {
  if (view === 'perps') {
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

const calculateMaxDrawdown = (data: PortfolioResponse[1][1]) => {
  const pnl = data.pnlHistory.map(([, v]) => Number(v))
  const acv = data.accountValueHistory.map(([, v]) => Number(v))

  let maxDrawdown = 0
  const baseAcv = acv[0]

  for (let i = 0; i < pnl.length; i++) {
    if (acv[i] < 100) continue
    const denom = Math.max(acv[i], baseAcv)
    for (let j = i + 1; j < pnl.length; j++) {
      const drawdown = (pnl[j] - pnl[i]) / denom
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown
      }
    }
  }

  return formatPercent(Math.abs(maxDrawdown))
}

export const PortfolioStats = () => {
  const [openTime, setOpenTime] = useState(false)
  const [openStatView, setOpenStatView] = useState(false)
  const [statView, setStatView] = useState<(typeof STAT_VIEWS)[number]>(
    STAT_VIEWS[0],
  )
  const [time, setTime] = useState<(typeof TIME)[number]>(TIME[0])
  const address = useAccount('evm')

  const {
    data,
    isLoading: isLoadingPortfolio,
    error: portfolioError,
  } = usePortfolio({ address })
  const {
    spotEquity,
    perpsEquity,
    isLoading: isLoadingAccountValues,
    error: accountValuesError,
  } = useUserAccountValues()
  const {
    data: borrowLendState,
    isLoading: isLoadingBorrowLend,
    error: borrowLendError,
  } = useBorrowLendUserState({ address })
  const {
    data: userVaultEquities,
    isLoading: isLoadingUserVaultEquities,
    error: userVaultEquitiesError,
  } = useUserVaultEquities({ address })
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()

  const isLoading =
    isLoadingPortfolio ||
    isLoadingAccountValues ||
    isLoadingBorrowLend ||
    isLoadingUserVaultEquities
  const error =
    portfolioError ||
    accountValuesError ||
    borrowLendError ||
    userVaultEquitiesError

  const vaultEquity = useMemo(() => {
    if (!userVaultEquities) return 0
    return userVaultEquities?.reduce((acc, { equity }) => {
      return acc + Number(equity)
    }, 0)
  }, [userVaultEquities])

  const earnBalance = useMemo(() => {
    if (!borrowLendState) return 0
    return borrowLendState.tokenToState.reduce((acc, [, bal]) => {
      return acc + Number(bal.supply.value)
    }, 0)
  }, [borrowLendState])

  const statData = useMemo(() => {
    if (!data) return null
    const key = getKey(time, statView)
    const dataForKey = data?.find(([d, _data]) => d === key)?.[1]
    const dataForTotalEquity = data?.find(([d, _data]) => d === 'allTime')?.[1]
    if (!dataForKey) return null
    return {
      pnl: dataForKey?.pnlHistory?.[dataForKey.pnlHistory.length - 1]?.[1],
      volume: dataForKey?.vlm,
      maxDrawdown: calculateMaxDrawdown(dataForKey),
      totalEquity:
        dataForTotalEquity?.accountValueHistory?.[
          dataForTotalEquity.accountValueHistory.length - 1
        ]?.[1],
    }
  }, [data, statView, time])

  return (
    <PerpsCard className="p-2 gap-2 flex flex-col" fullWidth>
      <div className="flex items-center justify-between gap-2  whitespace-nowrap text-xs lg:text-sm">
        <DropdownMenu open={openStatView} onOpenChange={setOpenStatView}>
          <DropdownMenuTrigger className="capitalize flex items-center">
            {statView}{' '}
            <DownTriangleIcon
              className={classNames(
                'w-1.5 h-1.5 min-w-1.5 ml-1 transition-transform',
                openStatView ? 'rotate-180' : '',
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="paper !rounded-md !bg-black/10">
            {STAT_VIEWS.map((view) => (
              <DropdownMenuItem
                key={view}
                className="capitalize"
                onClick={() => {
                  setStatView(view)
                }}
              >
                {view}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
      {isLoading ? (
        <div className="flex flex-col gap-1.5">
          {new Array(8).fill(0).map((_, i) => (
            <div
              className="flex items-center justify-between"
              key={`portfolio-skeleton-${i}`}
            >
              <SkeletonText fontSize="xs" className="max-w-[75px]" />
              <SkeletonText fontSize="xs" className="max-w-[75px] ml-auto" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading stats</div>
      ) : (
        <div className="flex flex-col gap-2">
          <StatItem
            title="PNL"
            value={
              <span
                className={classNames(
                  Number(statData?.pnl) === 0
                    ? ''
                    : getTextColorClass(Number(statData?.pnl) || 0),
                )}
              >
                {currencyFormatter.format(Number(statData?.pnl || 0))}
              </span>
            }
          />
          <StatItem
            title="Volume"
            value={currencyFormatter.format(Number(statData?.volume || 0))}
          />
          <StatItem
            title="Max Drawdown"
            value={statData?.maxDrawdown || formatPercent(0)}
          />
          <StatItem
            title="Total Equity"
            value={currencyFormatter.format(Number(statData?.totalEquity || 0))}
          />
          {isUnifiedAccountModeEnabled ? (
            <StatItem
              title={
                <HoverCard openDelay={0} closeDelay={0}>
                  <HoverCardTrigger asChild tabIndex={0}>
                    <div className="text-muted-foreground underline">
                      Trading Equity
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    forceMount
                    side="top"
                    className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                  >
                    <p>Includes spot and perps accounts</p>
                  </HoverCardContent>
                </HoverCard>
              }
              value={currencyFormatter.format(
                Number(perpsEquity || 0) + Number(spotEquity || 0),
              )}
            />
          ) : (
            <>
              <StatItem
                title="Perps Account Equity"
                value={currencyFormatter.format(Number(perpsEquity || 0))}
              />
              <StatItem
                title="Spot Account Equity"
                value={currencyFormatter.format(Number(spotEquity || 0))}
              />
            </>
          )}
          <StatItem
            title="Vault Equity"
            value={currencyFormatter.format(Number(vaultEquity || 0))}
          />
          <StatItem
            title="Earn Balance"
            value={currencyFormatter.format(Number(earnBalance || 0))}
          />
        </div>
      )}
    </PerpsCard>
  )
}
