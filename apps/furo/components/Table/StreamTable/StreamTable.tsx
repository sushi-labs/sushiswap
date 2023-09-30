import { Card, CardContent, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { useAccount } from '@sushiswap/wagmi'
import { PaginationState } from '@tanstack/react-table'
import { FC, ReactNode, useMemo, useState } from 'react'

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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Dashboard {data?.length ? <span className="text-gray-400 dark:text-slate-500">({data?.length})</span> : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0 !pb-0">
        <DataTable
          loading={loading}
          columns={COLUMNS}
          data={data}
          pagination={true}
          onPaginationChange={setPagination}
          state={{
            pagination,
          }}
          linkFormatter={(row) => `/${row instanceof Stream ? 'stream' : 'vesting'}/${row.chainId}:${row.id}`}
        />
      </CardContent>
    </Card>
  )
}
