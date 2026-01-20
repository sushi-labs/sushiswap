import { Button, Card, CardContent, CardGroup, classNames } from '@sushiswap/ui'
import { ArrowsLeftRightIcon } from '@sushiswap/ui/icons/ArrowsLeftRight'
import { type ReactNode, useMemo } from 'react'
import { currencyFormatter, enUSFormatNumber } from 'src/lib/perps/utils'
import { useUserState } from '~evm/perps/user-provider'
import { Deposit } from './deposit'

export const AccountManagement = ({ className }: { className?: string }) => {
  const {
    state: {
      allDexClearinghouseStateQuery: { data },
    },
  } = useUserState()

  const unrelaizedPnL = useMemo(() => {
    if (!data) return 0
    return data.clearinghouseStates.reduce((acc, [_dex, state]) => {
      return state.assetPositions.reduce((posAcc, pos) => {
        const pnl = Number(pos.position.unrealizedPnl ?? 0)
        return posAcc + pnl
      }, acc)
    }, 0)
  }, [data])

  const balance = useMemo(() => {
    if (!data) return 0
    return data?.clearinghouseStates.reduce((acc, [_dex, state]) => {
      return acc + Number(state.marginSummary.accountValue ?? 0)
    }, 0)
  }, [data])
  const maintenanceMargin = useMemo(() => {
    if (!data) return 0
    return data.clearinghouseStates.reduce((acc, [_dex, state]) => {
      return acc + Number(state.crossMaintenanceMarginUsed ?? 0)
    }, 0)
  }, [data])
  const totalCrossMarginRatio = useMemo(() => {
    if (!data) return 0
    return maintenanceMargin / (balance || 1) //guard for 0
  }, [maintenanceMargin, balance, data])
  const crossAccountLeverage = useMemo(() => {
    if (!data) return 0
    return data.clearinghouseStates.reduce((acc, [_dex, state]) => {
      const totalNtlPos = Number(state.crossMarginSummary?.totalNtlPos ?? 0)
      const accountValue = Number(state.crossMarginSummary?.accountValue) || 1 //guard for 0
      return acc + totalNtlPos / accountValue
    }, 0)
  }, [data])

  // @todo: spot account value
  // @todo: tooltips for perps, balance, xmr, mm, cal
  // @todo: use value sensitive components for currency values
  // @todo: skeleton loading state
  // @todo: error state
  // @todo: deposit modal
  // @todo: withdrawal modal
  // @todo: perps <-> spot transfer modal

  return (
    <Card className={classNames('p-2 flex flex-col gap-2', className ?? '')}>
      <Deposit />
      <div className="flex items-center gap-2">
        <Button className="w-full" variant="secondary" size="sm">
          Perps <ArrowsLeftRightIcon className="w-2 h-2" /> Spot
        </Button>
        <Button className="w-full" variant="secondary" size="sm">
          Widthaw
        </Button>
      </div>
      <hr className="my-2 border-t border-accent" />
      <CardContent className="!p-0 !gap-2">
        <CardGroup className="!gap-1">
          <p className="text-xs font-semibold">Account Equity</p>
          <_CardItem title="Spot" value={'todo'} />
          <_CardItem title="Perps" value={currencyFormatter.format(balance)} />
        </CardGroup>
        <CardGroup className="!gap-1">
          <p className="text-xs font-semibold">Perps Overview</p>
          <_CardItem
            title="Balance"
            value={currencyFormatter.format(balance)}
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
