import {
  Button,
  Card,
  CardContent,
  CardGroup,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { ArrowsLeftRightIcon } from '@sushiswap/ui/icons/ArrowsLeftRight'
import { type ReactNode, useMemo } from 'react'
import {
  currencyFormatter,
  enUSFormatNumber,
  getTextColorClass,
} from 'src/lib/perps/utils'
import { useUserState } from '~evm/perps/user-provider'
import { ValueSensitiveText } from '../value-sensitive-text'
import { Deposit } from './deposit'

export const AccountManagement = ({ className }: { className?: string }) => {
  const {
    state: {
      webData2Query: { data },
    },
  } = useUserState()

  const spotEquity = useMemo(() => {
    if (!data) return 0
    return (
      data?.spotState?.balances.reduce((acc, bal) => {
        return acc + Number(bal.total ?? 0)
      }, 0) ?? 0
    )
  }, [data])

  const unrelaizedPnL = useMemo(() => {
    if (!data) return 0
    return data.clearinghouseState.assetPositions.reduce((posAcc, pos) => {
      const pnl = Number(pos.position.unrealizedPnl ?? 0)
      return posAcc + pnl
    }, 0)
  }, [data])

  const perpsEquity = useMemo(() => {
    if (!data) return 0
    return Number(data?.clearinghouseState.withdrawable ?? 0) + unrelaizedPnL
  }, [data, unrelaizedPnL])

  const perpsBalance = useMemo(() => {
    //Total Net Transfers + Total Realized Profit + Total Net

    if (!data) return 0
    return Number(data?.clearinghouseState.withdrawable ?? 0)
  }, [data])

  const maintenanceMargin = useMemo(() => {
    if (!data) return 0
    return Number(data.clearinghouseState.crossMaintenanceMarginUsed ?? 0)
  }, [data])

  const totalCrossMarginRatio = useMemo(() => {
    if (!data) return 0
    return maintenanceMargin / (perpsEquity || 1) //guard for 0
  }, [maintenanceMargin, perpsEquity, data])

  const crossAccountLeverage = useMemo(() => {
    if (!data) return 0
    const totalNtlPos = Number(
      data?.clearinghouseState.crossMarginSummary?.totalNtlPos ?? 0,
    )
    const accountValue =
      Number(data.clearinghouseState.crossMarginSummary?.accountValue) || 1 //guard for 0
    return totalNtlPos / accountValue
  }, [data])

  // @todo: skeleton loading state
  // @todo: error state
  // @todo: deposit modal
  // @todo: withdrawal modal
  // @todo: perps <-> spot transfer modal

  return (
    <Card
      className={classNames(
        'p-2 flex flex-col-reverse lg:flex-col gap-2',
        className ?? '',
      )}
    >
      <div className="flex flex-col gap-2">
        <Deposit />
        <div className="flex items-center gap-2">
          <Button className="w-full" variant="secondary" size="sm">
            Perps <ArrowsLeftRightIcon className="w-2 h-2" /> Spot
          </Button>
          <Button className="w-full" variant="secondary" size="sm">
            Withdraw
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <hr className="my-10.5border-t border-accent hidden lg:block" />
        <CardContent className="!p-0 !gap-2">
          <CardGroup className="!gap-1">
            <p className="text-xs font-semibold mb-2 lg:mb-1">Account Equity</p>
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
                    <div className="text-muted-foreground underline">Perps</div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    forceMount
                    side="top"
                    className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                  >
                    <p>
                      Balance + Unrealized PNL (approximate account value if all
                      positions were closed).
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
            <p className="text-xs font-semibold mb-2 lg:mb-1">Perps Overview</p>
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
                      Total Net Transfers + Total Realized Profit + Total Net
                      Funding Fees.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              }
              value={currencyFormatter.format(perpsBalance)}
            />
            <_CardItem
              title="Unrealized PnL"
              value={currencyFormatter.format(unrelaizedPnL)}
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
                      Maintenance Margin / Portfolio Value. Your cross positions
                      will be liquidated if Margin Ratio reaches 100%.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              }
              value={
                <span
                //@todo @dev: will need a text color change, come back to this
                // className={classNames(
                //   getTextColorClass(totalCrossMarginRatio),
                // )}
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
                      The minimum portfolio value required to keep your cross
                      positions open.
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
