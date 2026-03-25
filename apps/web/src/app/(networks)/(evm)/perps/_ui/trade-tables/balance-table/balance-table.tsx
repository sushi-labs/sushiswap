import { DataTable, useBreakpoint } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { type BalanceItemType, useBalances } from 'src/lib/perps'
import { PerpSpotTransferDialog, SendDialog } from '../../account-management'
import { MobileTable } from '../_common'
import { type TradeFilterType, useTradeTables } from '../trade-tables-provider'
import {
  AVAILABLE_BALANCE_COLUMN,
  COIN_COLUMN,
  CONTRACT_COLUMN,
  PNL_COLUMN,
  SEND_COLUMN,
  TOTAL_BALANCE_COLUMN,
  TRANSFER_COLUMN,
  USDC_VALUE_COLUMN,
} from './columns'

type BalanceAction = 'send' | 'transfer' | 'evm-core-transfer'
const getBalanceColumns = ({
  openModal,
  isMobile,
}: {
  openModal: (action: BalanceAction, balance: BalanceItemType) => void
  isMobile: boolean
}): ColumnDef<BalanceItemType, unknown>[] => {
  if (isMobile) {
    return [
      COIN_COLUMN,
      TOTAL_BALANCE_COLUMN,
      AVAILABLE_BALANCE_COLUMN,
      USDC_VALUE_COLUMN,
      PNL_COLUMN,
      SEND_COLUMN(openModal),
      TRANSFER_COLUMN(openModal),
      CONTRACT_COLUMN,
    ]
  }
  return [
    COIN_COLUMN,
    USDC_VALUE_COLUMN,
    TOTAL_BALANCE_COLUMN,
    AVAILABLE_BALANCE_COLUMN,
    PNL_COLUMN,
    SEND_COLUMN(openModal),
    TRANSFER_COLUMN(openModal),
    CONTRACT_COLUMN,
  ]
}

export const BalanceTable = () => {
  const { isLg } = useBreakpoint('lg')
  const { data, isLoading, isError } = useBalances()
  const [sorting, setSorting] = useState([{ id: 'usdcValue', desc: true }])
  const {
    state: { hideSmallBalances, tradeFilter },
  } = useTradeTables()
  const filterValue = tradeFilter?.balances?.split(':')?.[1] as
    | TradeFilterType
    | undefined
  const [activeModal, setActiveModal] = useState<ActiveModalState>({
    open: false,
    action: null,
    balance: null,
  })

  const openModal = useCallback(
    (action: BalanceAction, balance: BalanceItemType) => {
      setActiveModal({
        open: true,
        action,
        balance,
      })
    },
    [],
  )

  const closeModal = useCallback(() => {
    setActiveModal({
      open: false,
      action: null,
      balance: null,
    })
  }, [])

  const columns = useMemo(() => {
    return getBalanceColumns({ openModal, isMobile: !isLg })
  }, [openModal, isLg])

  const tableData = useMemo(() => {
    if (isError || !data) return []
    let _data = data
    if (hideSmallBalances) {
      _data = data.filter((item) => Number(item.usdcValue) > 5)
    }
    if (filterValue) {
      //filterValue all or long do nothing
      if (filterValue === 'short') {
        //no short positions in balances
        _data = []
      }
      if (filterValue === 'active') {
        _data = data.filter(
          (item) =>
            Number(item.usdcValue) >= 0.01 &&
            item.marketType === 'spot' &&
            item.coin !== 'USDC (Spot)',
        )
      }
    }

    return _data
  }, [data, isError, hideSmallBalances, filterValue])

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
        />
      ) : (
        <MobileTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          sorting={sorting}
        />
      )}
      <SharedPositionModal activeModal={activeModal} onClose={closeModal} />
    </>
  )
}

type ActiveModalState = {
  open: boolean
  action: BalanceAction | null
  balance: BalanceItemType | null
}

const SharedPositionModal = ({
  activeModal,
  onClose,
}: {
  activeModal: ActiveModalState
  onClose: () => void
}) => {
  const { open, action, balance } = activeModal

  if (!open || !action || !balance) return null

  switch (action) {
    case 'send':
      return (
        <SendDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          balanceItem={balance}
          trigger={<div />}
        />
      )
    case 'transfer':
      return (
        <PerpSpotTransferDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          balanceItem={balance}
          trigger={<div />}
          defaultDst={balance?.marketType === 'perp' ? 'spot' : 'perp'}
        />
      )

    default:
      return null
  }
}
