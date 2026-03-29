import { DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import {
  type UserOpenOrdersItemType,
  formatPrice,
  formatSize,
  prepModifyOrderData,
  useCancelOpenOrders,
  useModifyOrder,
  useUserOpenOrders,
} from 'src/lib/perps'
import { MobileTable } from '../_common'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'
import {
  CANCEL_COLUMN,
  COIN_COLUMN,
  DIRECTION_COLUMN,
  OG_SIZE_COLUMN,
  PRICE_COLUMN,
  REDUCE_COLUMN,
  SIZE_COLUMN,
  TIME_COLUMN,
  TP_SL_COLUMN,
  TRIGGER_CONDITIONS_COLUMN,
  TYPE_COLUMN,
  VALUE_COLUMN,
} from './columns'

const getOpenOrdersColumns = ({
  handleConfirmModify,
  isModifyPending,
  isMobile,
  handleCancelOrder,
  isCancelPending,
}: {
  handleConfirmModify: (
    openOrder: UserOpenOrdersItemType,
    newValue: string,
    type: 'size' | 'price',
  ) => void
  isModifyPending: boolean
  isMobile: boolean
  handleCancelOrder: (order: UserOpenOrdersItemType) => void
  isCancelPending: boolean
}): ColumnDef<UserOpenOrdersItemType, unknown>[] => {
  if (isMobile) {
    return [
      COIN_COLUMN,
      TYPE_COLUMN,
      SIZE_COLUMN({ handleConfirmModify, isModifyPending }),
      TIME_COLUMN,
      DIRECTION_COLUMN,
      OG_SIZE_COLUMN,
      VALUE_COLUMN,
      PRICE_COLUMN({ handleConfirmModify, isModifyPending }),
      REDUCE_COLUMN,
      TRIGGER_CONDITIONS_COLUMN,
      TP_SL_COLUMN,
      CANCEL_COLUMN({
        onCancelOrder: handleCancelOrder,
        isCancelPending,
      }),
    ]
  }
  return [
    TIME_COLUMN,
    TYPE_COLUMN,
    COIN_COLUMN,
    DIRECTION_COLUMN,
    SIZE_COLUMN({ handleConfirmModify, isModifyPending }),
    OG_SIZE_COLUMN,
    VALUE_COLUMN,
    PRICE_COLUMN({ handleConfirmModify, isModifyPending }),
    REDUCE_COLUMN,
    TRIGGER_CONDITIONS_COLUMN,
    TP_SL_COLUMN,
    CANCEL_COLUMN({
      onCancelOrder: handleCancelOrder,
      isCancelPending,
    }),
  ]
}

export const OpenOrdersTable = () => {
  const { data, isLoading, isError } = useUserOpenOrders({})
  const { isLg } = useBreakpoint('lg')
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }])
  const {
    state: { tradeFilter },
  } = useTradeTables()
  const filterValue = tradeFilter?.['open-orders']?.split(':')?.[1] as
    | TradeFilterType
    | undefined

  const { modifyOrder, isPending } = useModifyOrder()
  const { cancelOrders, isPending: isCancelPending } = useCancelOpenOrders()

  const handleConfirmModify = useCallback(
    (
      openOrder: UserOpenOrdersItemType,
      newValue: string,
      type: 'size' | 'price',
    ) => {
      if (openOrder.szDecimals === undefined) return

      try {
        const currentOrderData = prepModifyOrderData(openOrder)

        if (!currentOrderData) return
        let value = newValue
        if (type === 'price') {
          value = formatPrice(
            newValue,
            openOrder.szDecimals,
            openOrder.marketType,
          )
        } else {
          value = formatSize(newValue, openOrder.szDecimals)
        }

        modifyOrder({
          ...currentOrderData,
          [type]: value,
        })
      } catch (e) {
        console.error('Failed to modify order size', e)
      }
    },
    [modifyOrder],
  )

  const handleCancelOrder = useCallback(
    (order: UserOpenOrdersItemType) => {
      try {
        cancelOrders({
          cancelData: [
            {
              orderId: order.oid,
              asset: order.coin,
            },
          ],
        })
      } catch (e) {
        console.error('Failed to cancel order', e)
      }
    },
    [cancelOrders],
  )

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data

    if (filterValue) {
      //filterValue all or active do nothing
      if (filterValue === 'long') {
        _data = data.filter((item) => item.side === 'B')
      }
      if (filterValue === 'short') {
        _data = data.filter((item) => item.side === 'A')
      }
    }

    return _data
  }, [data, isError, filterValue])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: tableData.length,
      },
    }
  }, [tableData, sorting])

  const columns = useMemo(() => {
    return getOpenOrdersColumns({
      handleConfirmModify,
      isModifyPending: isPending,
      isMobile: !isLg,
      handleCancelOrder,
      isCancelPending,
    })
  }, [handleConfirmModify, isPending, isLg, handleCancelOrder, isCancelPending])

  return (
    <>
      {isLg ? (
        <DataTableVirtual
          state={state}
          loading={isLoading}
          columns={columns}
          data={tableData}
          onSortingChange={setSorting}
          thClassName="!h-8"
          hideScrollbar={true}
        />
      ) : (
        <MobileTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          sorting={sorting}
        />
      )}
    </>
  )
}
