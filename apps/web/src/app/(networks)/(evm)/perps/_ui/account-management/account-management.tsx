import {
  Card,
  CardContent,
  CardGroup,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useMemo } from 'react'
import {
  currencyFormatter,
  enUSFormatNumber,
  getTextColorClass,
} from 'src/lib/perps/utils'
import { useUserState } from '~evm/perps/user-provider'
import { useAssetListState } from '../asset-list-provider'
import { ValueSensitiveText } from '../value-sensitive-text'
import { AccountManagementSkeleton } from './account-management-skeleton'
import { Deposit } from './deposit'
import { PerpSpotTransfer } from './perp-spot-transfer'
import { Withdraw } from './withdraw'

export const AccountManagement = ({ className }: { className?: string }) => {
  const {
    state: {
      webData2Query: {
        data: webData2,
        isLoading: isLoadingWebData2,
        error: errorWebData2,
      },
      allDexClearinghouseStateQuery: {
        data: allDexClearinghouseState,
        isLoading: allDexLoading,
        error: allDexError,
      },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const isLoading = isLoadingWebData2 || allDexLoading
  const error = errorWebData2 || allDexError

  const spotEquity = useMemo(() => {
    if (!webData2) return 0
    return (
      webData2?.spotState?.balances.reduce((acc, asset) => {
        const balance = Number(asset?.total) ?? 0
        if (asset.coin === 'USDC') {
          return acc + balance
        }
        //has to be better way to get this, wth. most likely not seeing it in the sdk
        const tokenIndex = asset?.token
        const spot = assetList
          ?.entries()
          .find(([, v]) => v.tokens?.find((t) => t.index === tokenIndex))?.[1]
        const price = Number(spot?.lastPrice) ?? 0
        const val = balance * price
        return acc + val
      }, 0) ?? 0
    )
  }, [webData2, assetList])

  const unrelaizedPnL = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return allDexClearinghouseState.clearinghouseStates.reduce(
      (posAcc, [_dex, pos]) => {
        return pos.assetPositions.reduce((assetAcc, assetPos) => {
          const unrealizedPnl = Number(assetPos.position.unrealizedPnl ?? 0)
          return assetAcc + unrealizedPnl
        }, posAcc)
      },
      0,
    )
  }, [allDexClearinghouseState])

  const perpsEquity = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return allDexClearinghouseState?.clearinghouseStates.reduce(
      (posAcc, [_dex, pos]) => {
        return Number(pos.marginSummary?.accountValue ?? 0) + posAcc
      },
      0,
    )
  }, [allDexClearinghouseState])

  const perpsBalance = useMemo(() => {
    if (!unrelaizedPnL || !perpsEquity) return 0
    return perpsEquity - unrelaizedPnL
  }, [perpsEquity, unrelaizedPnL])

  const maintenanceMargin = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return (
      allDexClearinghouseState?.clearinghouseStates?.reduce(
        (posAcc, [_dex, pos]) => {
          return Number(pos.crossMaintenanceMarginUsed ?? 0) + posAcc
        },
        0,
      ) || 0
    )
  }, [allDexClearinghouseState])

  const totalCrossMarginRatio = useMemo(() => {
    if (!perpsEquity) return 0
    return (maintenanceMargin / (perpsEquity || 1)) * 100
  }, [maintenanceMargin, perpsEquity])

  const crossAccountLeverage = useMemo(() => {
    if (!perpsEquity || !allDexClearinghouseState) return 0
    const totalNtlPos =
      allDexClearinghouseState?.clearinghouseStates.reduce(
        (posAcc, [_dex, pos]) => {
          return Number(pos.marginSummary?.totalNtlPos ?? 0) + posAcc
        },
        0,
      ) || 0

    return totalNtlPos / (perpsEquity || 1)
  }, [perpsEquity, allDexClearinghouseState])

  return (
    <Card
      className={classNames(
        'p-2 flex flex-col-reverse lg:flex-col gap-2',
        className ?? '',
      )}
    >
      {error ? (
        <>
          <div className="text-sm text-center italic pt-10 text-transparent lg:text-red">
            {error?.message ?? 'Error loading account data'}
          </div>
          <div className="text-red text-sm text-center italic pt-10 lg:text-transparent">
            {error?.message ?? 'Error loading account data'}
          </div>
        </>
      ) : isLoading ? (
        <AccountManagementSkeleton />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Deposit />
            <div className="flex items-center gap-2">
              <PerpSpotTransfer />
              <Withdraw />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <hr className="my-0.5 border-t border-accent hidden lg:block" />
            <CardContent className="!p-0 !gap-2">
              <CardGroup className="!gap-1">
                <p className="text-xs font-semibold mb-2 lg:mb-1">
                  Account Equity
                </p>
                <_CardItem
                  title="Spot"
                  value={
                    <ValueSensitiveText
                      value={spotEquity}
                      formatOptions={{
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }}
                    />
                  }
                />
                <_CardItem
                  title={
                    <HoverCard openDelay={0}>
                      <HoverCardTrigger asChild tabIndex={0}>
                        <div className="text-muted-foreground underline">
                          Perps
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        forceMount
                        side="top"
                        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                      >
                        <p>
                          Balance + Unrealized PNL (approximate account value if
                          all positions were closed).
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  }
                  value={
                    <ValueSensitiveText
                      value={perpsEquity}
                      formatOptions={{
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }}
                    />
                  }
                />
              </CardGroup>
              <hr className="border-t border-accent block lg:hidden" />
              <CardGroup className="!gap-1">
                <p className="text-xs font-semibold mb-2 lg:mb-1">
                  Perps Overview
                </p>
                <_CardItem
                  title={
                    <HoverCard openDelay={0}>
                      <HoverCardTrigger asChild tabIndex={0}>
                        <div className="text-muted-foreground underline">
                          Balance
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        forceMount
                        side="top"
                        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                      >
                        <p>
                          Total Net Transfers + Total Realized Profit + Total
                          Net Funding Fees.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  }
                  value={currencyFormatter.format(perpsBalance)}
                />
                <_CardItem
                  title="Unrealized PnL"
                  value={
                    <span
                      className={classNames(getTextColorClass(unrelaizedPnL))}
                    >
                      {currencyFormatter.format(unrelaizedPnL)}
                    </span>
                  }
                />
                <_CardItem
                  title={
                    <HoverCard openDelay={0}>
                      <HoverCardTrigger asChild tabIndex={0}>
                        <div className="text-muted-foreground underline">
                          Cross Margin Ratio
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        forceMount
                        side="top"
                        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                      >
                        <p>
                          Maintenance Margin / Portfolio Value. Your cross
                          positions will be liquidated if Margin Ratio reaches
                          100%.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  }
                  value={
                    <span
                      className={classNames(
                        totalCrossMarginRatio === 0
                          ? ''
                          : getTextColorClass(totalCrossMarginRatio),
                      )}
                    >
                      {enUSFormatNumber.format(totalCrossMarginRatio)}%
                    </span>
                  }
                />
                <_CardItem
                  title={
                    <HoverCard openDelay={0}>
                      <HoverCardTrigger asChild tabIndex={0}>
                        <div className="text-muted-foreground underline">
                          Maintenance Margin
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        forceMount
                        side="top"
                        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                      >
                        <p>
                          The minimum portfolio value required to keep your
                          cross positions open.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  }
                  value={currencyFormatter.format(maintenanceMargin)}
                />
                <_CardItem
                  title={
                    <HoverCard openDelay={0}>
                      <HoverCardTrigger asChild tabIndex={0}>
                        <div className="text-muted-foreground underline">
                          Cross Account Leverage
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        forceMount
                        side="top"
                        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                      >
                        <p>
                          Cross Account Leverage = Total Cross Positions Value /
                          Cross Account Value.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  }
                  value={`${enUSFormatNumber.format(crossAccountLeverage)}x`}
                />
              </CardGroup>
            </CardContent>
          </div>
        </>
      )}
    </Card>
  )
}

// easier that fighting styling of CardItem
const _CardItem = ({
  title,
  value,
}: {
  title: ReactNode
  value: ReactNode
}) => {
  return (
    <div className="grid grid-cols-2 text-xs font-medium">
      <div className="text-muted-foreground">{title}</div>
      <div className="justify-end flex">{value}</div>
    </div>
  )
}
