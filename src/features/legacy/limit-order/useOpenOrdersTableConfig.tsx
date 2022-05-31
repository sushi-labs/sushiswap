import { ChevronRightIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LimitOrder } from '@sushiswap/limit-order-sdk'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { DerivedOrder } from 'app/features/legacy/limit-order/types'
import React, { useMemo, useState } from 'react'
import { CellProps } from 'react-table'

export const useOpenOrdersTableConfig = ({
  orders,
  cancelOrder,
}: {
  orders?: DerivedOrder[]
  cancelOrder: (limitOrder: LimitOrder, type: string) => void
}) => {
  const { i18n } = useLingui()

  const data = useMemo(
    () => [
      {
        accessor: 'tokenOut',
        Header: 'Market',
        minWidth: 300,
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <div className="flex gap-2.5 items-center whitespace-nowrap truncate text-ellipsis">
              <div className="hidden lg:block">
                <CurrencyLogo currency={props.cell.row.original.tokenIn} className="!rounded-full" size={18} />
              </div>
              <Typography variant="xs" className="flex items-baseline gap-2 text-secondary">
                <Typography variant="xs" weight={700} component="span" className="text-high-emphesis">
                  {props.cell.row.original.limitOrder.amountIn.toSignificant(6)}
                </Typography>{' '}
                {props.cell.row.original.tokenIn.symbol}
              </Typography>
              <ChevronRightIcon width={20} className="text-primary" />
              <div className="hidden lg:block">
                <CurrencyLogo currency={props.cell.row.original.tokenOut} className="!rounded-full" size={18} />
              </div>
              <Typography variant="xs" className="flex items-baseline gap-2 text-secondary">
                <Typography variant="xs" weight={700} component="span" className="text-high-emphesis">
                  {props.cell.row.original.limitOrder.amountOut.toSignificant(6)}
                </Typography>{' '}
                {props.cell.row.original.tokenOut.symbol}
              </Typography>
            </div>
          )
        },
      },
      {
        accessor: 'rate',
        Header: 'Rate',
        width: 100,
        minWidth: 100,
        Cell: (props: CellProps<DerivedOrder>) => {
          const [invert, setInvert] = useState(false)

          return (
            <Typography
              variant="xs"
              className="flex items-baseline gap-2 cursor-pointer text-secondary"
              onClick={() => setInvert(!invert)}
            >
              <Typography weight={700} variant="xs" component="span" className="text-high-emphesis">
                {invert ? props.cell.value.invert().toSignificant(6) : props.cell.value.toSignificant(6)}
              </Typography>{' '}
              {invert ? props.cell.row.original.tokenIn.symbol : props.cell.row.original.tokenOut.symbol}
            </Typography>
          )
        },
      },
      {
        accessor: 'filledPercent',
        Header: 'Filled',
        width: 80,
        minWidth: 80,
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography weight={700} variant="xs" component="span" className="text-high-emphesis">
              {props.cell.value}%
            </Typography>
          )
        },
      },
      {
        accessor: 'timestamp',
        Header: 'Expires',
        width: 150,
        minWidth: 150,
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography weight={700} variant="xs">
              {Number(props.cell.row.original.limitOrder.endTime) === Number.MAX_SAFE_INTEGER
                ? 'Never'
                : new Date(Number(props.cell.row.original.limitOrder.endTime) * 1000).toLocaleString('en-uS', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: 'UTC',
                  })}
            </Typography>
          )
        },
      },
      {
        accessor: 'Updated',
        Header: 'Created at',
        width: 150,
        minWidth: 150,
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Typography weight={700} variant="xs">
              {new Date(Number(props.cell.row.original.limitOrder.startTime) * 1000).toLocaleString('en-uS', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'UTC',
              })}
            </Typography>
          )
        },
      },
      {
        accessor: 'id',
        Header: 'Cancel',
        width: 100,
        minWidth: 100,
        Cell: (props: CellProps<DerivedOrder>) => {
          return (
            <Button
              color="blue"
              variant="empty"
              size="xs"
              onClick={() => cancelOrder(props.cell.row.original.limitOrder, `Cancel order`)}
              className="whitespace-nowrap"
            >
              {i18n._(t`Cancel Order`)}
            </Button>
          )
        },
      },
    ],
    [cancelOrder, i18n]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: data,
        data: orders?.filter((order) => Number(order.limitOrder.endTime) * 1000 > Date.now()),
        defaultColumn,
        // initialState: {
        //   sortBy: [{ id: 'receive', desc: true }],
        // },
      },
    }),
    [orders, data, defaultColumn]
  )
}
