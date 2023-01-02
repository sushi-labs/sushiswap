// @ts-nocheck

import { AddressZero } from '@ethersproject/constants'
import { Amount, Token, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react'

import { type Stream as StreamDTO, type Vesting as VestingDTO, Rebase as RebaseDTO } from '../../../.graphclient'
import { FuroStatus, Stream, Vesting } from '../../../lib'
import {
  AMOUNT_COLUMN,
  FROM_COLUMN,
  START_DATE_COLUMN,
  STATUS_COLUMN,
  STREAMED_COLUMN,
  TYPE_COLUMN,
} from '../constants'

export enum FuroTableType {
  INCOMING,
  OUTGOING,
}

interface FuroTableProps {
  chainId: number | undefined
  balances: Record<string, Amount<Token>> | undefined
  globalFilter: boolean
  setGlobalFilter: Dispatch<SetStateAction<boolean>>
  streams: StreamDTO[]
  vestings: VestingDTO[]
  rebases: RebaseDTO[] | undefined
  type: FuroTableType
  placeholder: ReactNode
  loading: boolean
}

export const StreamTable: FC<FuroTableProps> = ({
  chainId,
  streams,
  vestings,
  rebases,
  placeholder,
  globalFilter,
  loading,
  type,
}) => {
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [columns] = useState([
    STREAMED_COLUMN,
    STATUS_COLUMN,
    TYPE_COLUMN,
    AMOUNT_COLUMN,
    FROM_COLUMN(type),
    START_DATE_COLUMN,
  ])

  const [columnVisibility, setColumnVisibility] = useState({})

  const data: Array<Stream | Vesting> = useMemo(() => {
    if (!chainId || !streams || !vestings || !rebases) return []
    return [
      ...streams
        .map(
          (stream) =>
            new Stream({
              chainId,
              furo: stream,
              rebase: rebases.find((rebase) =>
                stream.token.id === AddressZero
                  ? WNATIVE_ADDRESS[Number(chainId) as keyof typeof WNATIVE_ADDRESS].toLowerCase() === rebase.id
                  : rebase.id === stream.token.id
              ) as RebaseDTO,
            })
        )
        .filter((el) => (globalFilter ? el.status === FuroStatus.ACTIVE : true)),
      ...vestings
        .map(
          (vesting) =>
            new Vesting({
              chainId,
              furo: vesting,
              rebase: rebases.find((rebase) =>
                vesting.token.id === AddressZero
                  ? WNATIVE_ADDRESS[Number(chainId) as keyof typeof WNATIVE_ADDRESS].toLowerCase() === rebase.id
                  : rebase.id === vesting.token.id
              ) as RebaseDTO,
            })
        )
        .filter((el) => (globalFilter ? el.status === FuroStatus.ACTIVE : true)),
    ]
  }, [chainId, streams, vestings, rebases, globalFilter])

  const table = useReactTable<Stream | Vesting>({
    data: data,
    columns,
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
      })
    }
  }, [isMd, isSm])

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <GenericTable<Stream | Vesting>
      loading={loading}
      table={table}
      placeholder={placeholder}
      pageSize={Math.max(data.length, 5)}
      linkFormatter={(row) => `/${row instanceof Stream ? 'stream' : 'vesting'}/${row.id}?chainId=${row.chainId}`}
    />
  )
}
