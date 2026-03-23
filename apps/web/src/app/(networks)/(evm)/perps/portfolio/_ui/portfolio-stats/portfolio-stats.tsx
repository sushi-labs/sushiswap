'use client'
import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import type { PortfolioResponse } from '@nktkas/hyperliquid'
import {
  Card,
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
import { useMemo, useState } from 'react'
import {
  getTextColorClass,
  useBorrowLendUserState,
  useDelegatorSummary,
  usePortfolio,
  useUserAccountValues,
  useUserVaultEquities,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatNumber, formatPercent, formatUSD } from 'sushi'
import { StatItem } from '~evm/perps/_ui/_common'

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
    data: delegatorSummary,
    isLoading: isLoadingDelegations,
    error: delegationsError,
  } = useDelegatorSummary({ address })

  const isLoading =
    isLoadingPortfolio ||
    isLoadingAccountValues ||
    isLoadingBorrowLend ||
    isLoadingUserVaultEquities ||
    isLoadingDelegations
  const error =
    portfolioError ||
    accountValuesError ||
    borrowLendError ||
    userVaultEquitiesError ||
    delegationsError

  const stakingAccount = useMemo(() => {
    if (!delegatorSummary) return 0
    return (
      Number(delegatorSummary.delegated) + Number(delegatorSummary.undelegated)
    )
  }, [delegatorSummary])

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

  const totalEquity = useMemo(() => {
    return (spotEquity ?? 0) + (perpsEquity ?? 0)
  }, [perpsEquity, spotEquity])

  const statData = useMemo(() => {
    if (!data) return null
    const key = getKey(time, statView)
    const dataForKey = data?.find(([d, _data]) => d === key)?.[1]
    if (!dataForKey) return null
    return {
      pnl: dataForKey?.pnlHistory?.[dataForKey.pnlHistory.length - 1]?.[1],
      volume: dataForKey?.vlm,
      maxDrawdown: calculateMaxDrawdown(dataForKey),
    }
  }, [data, statView, time])

  return (
    <Card className="p-2 !rounded-md gap-2 flex !bg-[#18223B] border-transparent flex-col w-full">
      <div className="flex items-center justify-between gap-2  whitespace-nowrap text-xs lg:text-sm">
        <DropdownMenu open={openStatView} onOpenChange={setOpenStatView}>
          <DropdownMenuTrigger className="capitalize flex items-center">
            {statView}{' '}
            <ChevronDownIcon
              className={classNames(
                'w-4 h-4 min-w-4 ml-1 transition-transform',
                openStatView ? 'rotate-180' : '',
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="paper !rounded-md !bg-[#18223B]">
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
        <div className="flex flex-col gap-1.5">
          {new Array(9).fill(0).map((_, i) => (
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
            isPortfolioStat={true}
            title="PNL"
            value={
              <span
                className={classNames(
                  Number(statData?.pnl) === 0
                    ? ''
                    : getTextColorClass(Number(statData?.pnl) || 0),
                )}
              >
                {formatUSD(statData?.pnl || 0)}
              </span>
            }
          />
          <StatItem
            isPortfolioStat={true}
            title="Volume"
            value={formatUSD(statData?.volume || '0')}
          />
          <StatItem
            isPortfolioStat={true}
            title="Max Drawdown"
            value={statData?.maxDrawdown}
          />
          <StatItem
            isPortfolioStat={true}
            title="Total Equity"
            value={formatUSD(totalEquity)}
          />
          <StatItem
            isPortfolioStat={true}
            title="Perps Account Equity"
            value={formatUSD(perpsEquity)}
          />
          <StatItem
            isPortfolioStat={true}
            title="Spot Account Equity"
            value={formatUSD(spotEquity)}
          />
          <StatItem
            isPortfolioStat={true}
            title="Vault Equity"
            value={formatUSD(vaultEquity)}
          />
          <StatItem
            isPortfolioStat={true}
            title="Earn Balance"
            value={formatUSD(earnBalance)}
          />
          <StatItem
            isPortfolioStat={true}
            title={
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div className="text-[#81898C] underline">
                    Staking Account
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  forceMount
                  side="top"
                  className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                >
                  <p>Staking Balance + Total Staked.</p>
                </HoverCardContent>
              </HoverCard>
            }
            value={`${formatNumber(stakingAccount)} HYPE`}
          />
        </div>
      )}
    </Card>
  )
}
