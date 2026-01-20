import { Button, Card, CardContent, CardGroup, classNames } from '@sushiswap/ui'
import { ArrowsLeftRightIcon } from '@sushiswap/ui/icons/ArrowsLeftRight'
import { type ReactNode, useMemo } from 'react'
import { currencyFormatter, enUSFormatNumber } from 'src/lib/perps/utils'
import { useUserState } from '~evm/perps/user-provider'
import { ValueSensitiveText } from '../value-sensitive-text'
import { Deposit } from './deposit'

export const AccountManagement = ({ className }: { className?: string }) => {
  const {
    state: {
      webData2Query: { data },
    },
  } = useUserState()

  const spotBalance = useMemo(() => {
    if (!data) return 0
    return (
      data?.spotState?.balances.reduce((acc, bal) => {
        return acc + Number(bal.total ?? 0)
      }, 0) ?? 0
    )
  }, [data])

  const perpsBalance = useMemo(() => {
    if (!data) return 0
    return Number(data?.clearinghouseState.withdrawable ?? 0)
  }, [data])

  const unrelaizedPnL = useMemo(() => {
    if (!data) return 0
    return data.clearinghouseState.assetPositions.reduce((posAcc, pos) => {
      const pnl = Number(pos.position.unrealizedPnl ?? 0)
      return posAcc + pnl
    }, 0)
  }, [data])

  const maintenanceMargin = useMemo(() => {
    if (!data) return 0
    return Number(data.clearinghouseState.crossMaintenanceMarginUsed ?? 0)
  }, [data])

  const totalCrossMarginRatio = useMemo(() => {
    if (!data) return 0
    return maintenanceMargin / (perpsBalance || 1) //guard for 0
  }, [maintenanceMargin, perpsBalance, data])

  const crossAccountLeverage = useMemo(() => {
    if (!data) return 0
    const totalNtlPos = Number(
      data?.clearinghouseState.crossMarginSummary?.totalNtlPos ?? 0,
    )
    const accountValue =
      Number(data.clearinghouseState.crossMarginSummary?.accountValue) || 1 //guard for 0
    return totalNtlPos / accountValue
  }, [data])

  // @todo: tooltips for perps, balance, xmr, mm, cal
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
                  value={spotBalance}
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
              title="Perps"
              value={
                <ValueSensitiveText
                  value={perpsBalance}
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
              title="Balance"
              value={currencyFormatter.format(perpsBalance)}
            />
            <_CardItem
              title="Unrealized PnL"
              value={currencyFormatter.format(unrelaizedPnL)}
            />
            <_CardItem
              title="Cross Margin Ratio"
              value={`${enUSFormatNumber.format(totalCrossMarginRatio)}%`}
            />
            <_CardItem
              title="Maintenance Margin"
              value={currencyFormatter.format(maintenanceMargin)}
            />
            <_CardItem
              title="Cross Account Leverage"
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
