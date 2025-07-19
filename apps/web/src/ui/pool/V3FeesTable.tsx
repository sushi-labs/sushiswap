'use client'

import type { V3BasePool } from '@sushiswap/graph-client/data-api'
import {
  Badge,
  Button,
  Currency,
  DataTable,
  SkeletonCircle,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import {
  type FC,
  type MouseEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { ProtocolBadge } from 'src/ui/pool/PoolNameCell'
import { formatNumber, formatUSD } from 'sushi'
import {
  type EvmAddress,
  EvmChain,
  type EvmChainId,
  EvmToken,
  getEvmChainById,
  uniswapV3PoolAbi_setFeeProtocol,
} from 'sushi/evm'
import {
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

type V3Pool = Omit<V3BasePool, 'token0' | 'token1'> & {
  token0: EvmToken
  token1: EvmToken
}

const NAME_COLUMN_POOL: ColumnDef<V3Pool, unknown> = {
  id: 'name',
  header: 'Name',

  cell: (props) => (
    <div className="flex items-center gap-5">
      <div className="flex min-w-[54px]">
        <Badge
          className="border-2 border-slate-900 rounded-full z-[11]"
          position="bottom-right"
          badgeContent={
            <NetworkIcon
              chainId={props.row.original.chainId}
              width={14}
              height={14}
            />
          }
        >
          <Currency.IconList iconWidth={26} iconHeight={26}>
            <Currency.Icon disableLink currency={props.row.original.token0} />
            <Currency.Icon disableLink currency={props.row.original.token1} />
          </Currency.IconList>
        </Badge>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {props.row.original.token0.symbol}{' '}
          <span className="font-normal text-gray-900 dark:text-slate-500">
            /
          </span>{' '}
          {props.row.original.token1.symbol}{' '}
          <div
            className={classNames(
              'text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1',
            )}
          />
        </span>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {ProtocolBadge['SUSHISWAP_V3']}
              </TooltipTrigger>
              <TooltipContent>
                <p>Protocol version</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                  {formatNumber(props.row.original.swapFee * 100)}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swap fee</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  ),
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={26} />
            <SkeletonCircle radius={26} className="-ml-[12px]" />
          </div>
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
  size: 300,
}

const TVL_COLUMN: ColumnDef<V3Pool, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.liquidityUSD,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.liquidityUSD - rowB.liquidityUSD,
  cell: (props) =>
    formatUSD(props.row.original.liquidityUSD).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.liquidityUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const VOLUME_COLUMN: ColumnDef<V3Pool, unknown> = {
  id: 'volumeUSD',
  header: 'Volume',
  accessorFn: (row) => row.volumeUSD,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.volumeUSD - rowB.volumeUSD,
  cell: (props) =>
    formatUSD(props.row.original.volumeUSD).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.volumeUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const EnableProtocolFeeButton: FC<{
  pool: EvmAddress
  chainId: EvmChainId
}> = ({ pool, chainId }) => {
  const { switchChainAsync } = useSwitchChain()
  const { data: txHash, writeContract, isPending } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault()
      switchChainAsync({ chainId }).then(() =>
        writeContract({
          address: pool,
          abi: uniswapV3PoolAbi_setFeeProtocol,
          functionName: 'setFeeProtocol',
          args: [4, 4],
          chainId,
        }),
      )
    },
    [writeContract, pool, chainId, switchChainAsync],
  )

  return isSuccess ? (
    '✅'
  ) : (
    <Button
      size="xs"
      variant="secondary"
      loading={isPending || isLoading}
      onClick={onClick}
    >
      {isLoading ? 'Enabling' : 'Enable'}
    </Button>
  )
}

const PROTOCOL_FEE_COLUMN: ColumnDef<V3Pool, unknown> = {
  id: 'isProtocolFeeEnabled',
  header: 'Fees Enabled',
  accessorFn: (row) => row.volumeUSD,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    +rowA.isProtocolFeeEnabled! - +rowB.isProtocolFeeEnabled!,
  cell: (props) => (
    <div className="text-center w-full">
      {props.row.original.isProtocolFeeEnabled ? (
        '✅'
      ) : (
        <EnableProtocolFeeButton
          pool={props.row.original.address}
          chainId={props.row.original.chainId}
        />
      )}
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const COLUMNS = [
  NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_COLUMN,
  PROTOCOL_FEE_COLUMN,
]

export const V3FeesTable: FC<{ pools: V3BasePool[]; chainId: EvmChainId }> = ({
  pools,
  chainId,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const data: V3Pool[] = useMemo(
    () =>
      pools?.map((pool) => ({
        ...pool,
        token0: new EvmToken(pool.token0),
        token1: new EvmToken(pool.token1),
      })) ?? [],
    [pools],
  )

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data.length,
      },
    }
  }, [data.length, sorting])

  return (
    <DataTable
      state={state}
      onSortingChange={setSorting}
      loading={!pools}
      columns={COLUMNS}
      data={data}
      linkFormatter={(row) =>
        getEvmChainById(chainId)!.getAccountUrl(row.address)
      }
    />
  )
}
