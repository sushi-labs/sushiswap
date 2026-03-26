import { DataTable, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { type UserPositionsItemType, useUserPositions } from 'src/lib/perps'
import {
  EditTpSlPositionDialog,
  LimitCloseDialog,
  MarketCloseDialog,
  ReversePositionDialog,
  UpdateIsolatedMarginDialog,
  UpdateLeverageDialog,
} from '../../exchange'
import { MobileTable } from '../_common'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'
import {
  CLOSE_COLUMN,
  COIN_COLUMN,
  ENTRY_PRICE_COLUMN,
  FUNDING_COLUMN,
  LIQUIDATION_PRICE_COLUMN,
  MARGIN_COLUMN,
  MARK_PRICE_COLUMN,
  PNL_COLUMN,
  POSITION_VALUE_COLUMN,
  SIZE_COLUMN,
  TP_SL_COLUMN,
} from './columns'

type PositionAction =
  | 'limit-close'
  | 'market-close'
  | 'reverse'
  | 'edit-tpsl'
  | 'update-margin'
  | 'update-leverage'

const getPositionColumns = ({
  openModal,
  isMobile,
}: {
  openModal: (action: PositionAction, position: UserPositionsItemType) => void
  isMobile: boolean
}): ColumnDef<UserPositionsItemType, unknown>[] => {
  if (isMobile) {
    return [
      COIN_COLUMN(openModal),
      SIZE_COLUMN,
      PNL_COLUMN,
      ENTRY_PRICE_COLUMN,
      MARK_PRICE_COLUMN,
      LIQUIDATION_PRICE_COLUMN,
      POSITION_VALUE_COLUMN,
      MARGIN_COLUMN(openModal),
      FUNDING_COLUMN,
      TP_SL_COLUMN(openModal),
      CLOSE_COLUMN(openModal),
    ]
  }
  return [
    COIN_COLUMN(openModal),
    SIZE_COLUMN,
    POSITION_VALUE_COLUMN,
    ENTRY_PRICE_COLUMN,
    MARK_PRICE_COLUMN,
    PNL_COLUMN,
    LIQUIDATION_PRICE_COLUMN,
    MARGIN_COLUMN(openModal),
    FUNDING_COLUMN,
    TP_SL_COLUMN(openModal),
    CLOSE_COLUMN(openModal),
  ]
}

export const PositionsTable = () => {
  const { data, isLoading, isError } = useUserPositions()
  const [sorting, setSorting] = useState([{ id: 'size', desc: true }])
  const { isLg } = useBreakpoint('lg')
  const {
    state: { tradeFilter, expandAll },
  } = useTradeTables()
  const [activeModal, setActiveModal] = useState<ActiveModalState>({
    open: false,
    action: null,
    position: null,
  })

  const openModal = useCallback(
    (action: PositionAction, position: UserPositionsItemType) => {
      setActiveModal({
        open: true,
        action,
        position,
      })
    },
    [],
  )

  const closeModal = useCallback(() => {
    setActiveModal({
      open: false,
      action: null,
      position: null,
    })
  }, [])

  const columns = useMemo(() => {
    return getPositionColumns({ openModal, isMobile: !isLg })
  }, [openModal, isLg])

  const filterValue = tradeFilter?.['positions']?.split(':')?.[1] as
    | TradeFilterType
    | undefined

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

  return (
    <>
      {isLg ? (
        <DataTable
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
          isExpandedOverride={expandAll ?? undefined}
        />
      )}
      <SharedPositionModal activeModal={activeModal} onClose={closeModal} />
    </>
  )
}

type ActiveModalState = {
  open: boolean
  action: PositionAction | null
  position: UserPositionsItemType | null
}

const SharedPositionModal = ({
  activeModal,
  onClose,
}: {
  activeModal: ActiveModalState
  onClose: () => void
}) => {
  const { open, action, position } = activeModal

  if (!open || !action || !position) return null

  switch (action) {
    case 'limit-close':
      return (
        <LimitCloseDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          positionToClose={position}
          trigger={<div />}
        />
      )

    case 'market-close':
      return (
        <MarketCloseDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          positionToClose={position}
          trigger={<div />}
        />
      )

    case 'reverse':
      return (
        <ReversePositionDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          positionToClose={position}
          trigger={<div />}
        />
      )

    case 'edit-tpsl':
      return (
        <EditTpSlPositionDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          positionToClose={position}
          trigger={<div />}
        />
      )

    case 'update-margin':
      return (
        <UpdateIsolatedMarginDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          position={position}
          trigger={null}
        />
      )

    case 'update-leverage':
      return (
        <UpdateLeverageDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          assetString={position.position.coin}
          currentLeverage={position.position.leverage.value}
          isCross={position.position.leverage.type === 'cross'}
          trigger={<div />}
        />
      )

    default:
      return null
  }
}
