import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/components/table/GenericTable'
import { useAccount } from '@sushiswap/wagmi'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import { FuroStatus, Stream, Vesting } from '../../../lib'
import {
  AMOUNT_COLUMN,
  END_DATE_COLUMN,
  NETWORK_COLUMN,
  START_DATE_COLUMN,
  STREAMED_COLUMN,
  TYPE_COLUMN,
} from '../constants'

export enum FuroTableType {
  INCOMING = 'Incoming',
  OUTGOING = 'Outgoing',
}

interface FuroTableProps {
  activeOnly: boolean
  streams: (Stream | undefined)[] | null | undefined
  vestings: (Vesting | undefined)[] | null | undefined
  type: FuroTableType
  placeholder: ReactNode
  loading: boolean
}

export const StreamTable: FC<FuroTableProps> = ({ streams, vestings, placeholder, activeOnly, loading, type }) => {
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const [columnVisibility, setColumnVisibility] = useState({})

  const COLUMNS = useMemo(
    () => [NETWORK_COLUMN, AMOUNT_COLUMN, STREAMED_COLUMN, TYPE_COLUMN, START_DATE_COLUMN, END_DATE_COLUMN],
    []
  )

  const data = useMemo(() => {
    return [
      ...(streams
        ? streams
            .filter((el): el is Stream => !!el)
            .filter((el) => (activeOnly ? el.status === FuroStatus.ACTIVE : true))
            .filter((el) =>
              type === FuroTableType.INCOMING && address ? el.recipient.id === address.toLowerCase() : true
            )
            .filter((el) =>
              type === FuroTableType.OUTGOING && address ? el.createdBy.id === address.toLowerCase() : true
            )
        : []),
      ...(vestings
        ? vestings
            .filter((el): el is Vesting => !!el)
            .filter((el) => (activeOnly ? el.status === FuroStatus.ACTIVE : true))
            .filter((el) =>
              type === FuroTableType.INCOMING && address ? el.recipient.id === address.toLowerCase() : true
            )
            .filter((el) =>
              type === FuroTableType.OUTGOING && address ? el.createdBy.id === address.toLowerCase() : true
            )
        : []),
    ]
  }, [activeOnly, address, streams, type, vestings])

  const table = useReactTable<Stream | Vesting>({
    data: data,
    columns: COLUMNS,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    manualFiltering: true,
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ status: false, from: false, type: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        status: false,
        from: false,
        type: false,
        startDate: false,
        endDate: false,
      })
    }
  }, [isMd, isSm])

  return (
    <GenericTable<Stream | Vesting>
      loading={loading}
      table={table}
      placeholder={placeholder}
      pageSize={Math.max(data.length, 1)}
      linkFormatter={(row) => `/${row instanceof Stream ? 'stream' : 'vesting'}/${row.chainId}:${row.id}`}
    />
  )
}
