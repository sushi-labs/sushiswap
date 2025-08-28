import { useBreakpoint } from '@sushiswap/hooks'
import {
  Button,
  Card,
  DataTable,
  Dialog,
  DialogContent,
  Slot,
  classNames,
} from '@sushiswap/ui'
import type { Row, SortingState, TableState } from '@tanstack/react-table'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { SUSHI, USDC } from 'sushi/currency'
import {
  CHAIN_COLUMN,
  POOL_COLUMN,
  POOL_TYPE_COLUMN,
} from '../../pool/columns-v2'
import {
  APR_COLUMN,
  POSITION_SIZE_COLUMN,
  POSITION_UNCOLLECTED_COLUMN,
  PRICE_RANGE_COLUMN,
  REWARDS_COLUMN,
} from './columns'
import { LPPositionsTableHeader } from './lp-positions-table-header'
import { ManageDialog } from './manage-dialog/manage-dialog'
import { Trending } from './trending'

const columns: any[] = [
  CHAIN_COLUMN,
  POOL_COLUMN,
  POOL_TYPE_COLUMN,
  POSITION_SIZE_COLUMN,
  POSITION_UNCOLLECTED_COLUMN,
  REWARDS_COLUMN,
  APR_COLUMN,
  PRICE_RANGE_COLUMN,
]

const data: any[] = [
  {
    chainId: 1,
    name: 'Sushi / USDC',
    token0Address: SUSHI[1].address,
    token0: SUSHI[1],
    token1Address: USDC[1].address,
    token1: USDC[1],
    protocol: 'SUSHISWAP_V2',
    swapFee: 0.0003,
    position: {
      positionUSD: 12345.67,
      token0Size: 89.01,
      token1Size: 2345.67,
      unclaimedUSD: 0,
    },
    rewards: [],
    totalRewardsUSD: 0,
    apr: 109,
  },
  {
    chainId: 42161,
    name: 'Sushi / USDC',
    token0Address: SUSHI[42161].address,
    token0: SUSHI[42161],
    token1Address: USDC[42161].address,
    token1: USDC[42161],
    protocol: 'SUSHISWAP_V3',
    swapFee: 0.001,
    position: {
      positionUSD: 23456.78,
      token0Size: 123.45,
      token1Size: 6789.01,
      unclaimedUSD: 23.45,
      unclaimedToken0: 1.23,
      unclaimedToken1: 34.56,
    },
    rewards: [
      {
        token: SUSHI[1],
        amount: 11.7,
      },
    ],
    totalRewardsUSD: 20,
    apr: 109,
  },
]

export const LPPositionsTable = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [positionData, setPositionData] = useState<any>(null)
  const { isMd: isMdScreen } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'apr', desc: true },
  ])
  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [sorting])

  const rowRenderer = useCallback((row: Row<any>, rowNode: ReactNode) => {
    return (
      <Slot
        key={`row-${row.id}`}
        className="cursor-pointer"
        onClick={() => {
          setPositionData(row.original)
          setIsMobileDrawerOpen(true)
        }}
      >
        {rowNode}
      </Slot>
    )
  }, [])

  useEffect(() => {
    if (!isMobileDrawerOpen) {
      setPositionData(null)
    }
  }, [isMobileDrawerOpen])
  useEffect(() => {
    if (isMobileDrawerOpen && isMdScreen) {
      setIsMobileDrawerOpen(false)
      setIsManageOpen(false)
    }
  }, [isMdScreen, isMobileDrawerOpen])

  return (
    <>
      {/* <InfiniteScroll
		   dataLength={data.length}
		   next={fetchNextPage}
		   hasMore={data.length < (count ?? 0)}
		   loader={
		     <div className="flex justify-center py-4 w-full">
		       <Loader size={16} />
		     </div>
		   }
		 > */}
      <Card className="overflow-hidden dark:!bg-slate-800 !bg-slate-50">
        <Trending />
        <LPPositionsTableHeader />
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={false}
          rowRenderer={rowRenderer}
          columns={columns}
          data={data}
          className="border-t-0 dark:!border-[#FFFFFF14] !border-[#00000014]"
          tableRowClassName="dark:!border-[#FFFFFF14] !border-[#00000014]"
        />
      </Card>
      {/* </InfiniteScroll> */}
      {positionData && (
        <ManageDialog
          data={positionData}
          isOpen={isManageOpen}
          setIsOpen={setIsManageOpen}
        />
      )}

      <Dialog open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="!px-1 border-t !max-w-full md:!max-w-[520px] border-[#EBEBEB] rounded-t-none md:rounded-t-2xl !bg-slate-50 dark:border-[#FFFFFF14] dark:!bg-slate-800 w-full  max-h-[100dvh] overflow-y-auto hide-scrollbar"
        >
          <div className="flex flex-col gap-4 px-3 mt-14 w-full">
            <div className="flex gap-2 items-center">
              {positionData?.protocol === 'SUSHISWAP_V3' ? (
                <Button size="sm" className="w-full !rounded-full">
                  Claim
                </Button>
              ) : null}

              <Button
                onClick={() => setIsManageOpen(true)}
                size="sm"
                variant="networks"
                className="w-full !rounded-full dark:!bg-[#FFFFFF]/[.12] dark:hover:!bg-[#fff]/[.18] dark:active:!bg-[#fff]/[.24]"
              >
                Manage
              </Button>
            </div>
            <Button
              size="sm"
              variant="networks"
              className={classNames(
                'dark:!bg-[#FFFFFF]/[.12] dark:hover:!bg-[#fff]/[.18] dark:active:!bg-[#fff]/[.24]',
                '!rounded-full',
                positionData?.protocol === 'SUSHISWAP_V3'
                  ? 'w-1/2 mx-auto'
                  : 'w-full',
              )}
            >
              More
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
