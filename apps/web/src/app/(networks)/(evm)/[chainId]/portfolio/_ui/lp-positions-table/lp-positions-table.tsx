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
import {
  type EvmChainId,
  type MerklChainId,
  SushiSwapProtocol,
  isMerklChainId,
} from 'sushi/evm'

import type { PortfolioV2PositionPoolType } from '@sushiswap/graph-client/data-api'
import { useClaimableRewards } from 'src/lib/hooks/react-query'
import { useAccount } from 'wagmi'
import { useLPPositionContext } from '~evm/[chainId]/portfolio/lp-position-provider'
import { ClaimRewardsButton } from '~evm/claim/rewards/_common/ui/claim-rewards-button'
import {
  APR_COLUMN,
  CHAIN_COLUMN,
  POOL_COLUMN,
  POOL_TYPE_COLUMN,
  POSITION_SIZE_COLUMN,
  POSITION_UNCOLLECTED_COLUMN,
  PRICE_RANGE_COLUMN,
  REWARDS_COLUMN,
} from './columns'
import { LPPositionsTableHeader } from './lp-positions-table-header'
import { ManageDialog } from './manage-dialog/manage-dialog'
import { Trending } from './trending'

const columns = [
  CHAIN_COLUMN,
  POOL_COLUMN,
  POOL_TYPE_COLUMN,
  POSITION_SIZE_COLUMN,
  POSITION_UNCOLLECTED_COLUMN,
  REWARDS_COLUMN,
  APR_COLUMN,
  PRICE_RANGE_COLUMN,
]

export const LPPositionsTable = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [positionData, setPositionData] =
    useState<PortfolioV2PositionPoolType | null>(null)
  const { isMd: isMdScreen } = useBreakpoint('md')
  const {
    state: { lpPositionQuery },
  } = useLPPositionContext()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'positionSize', desc: true },
  ])

  const data = useMemo(() => {
    //@dev currently only data for v2 and v3
    const v2Data = lpPositionQuery?.data?.v2
    const v3Data = lpPositionQuery?.data?.v3
    return [...(v2Data ?? []), ...(v3Data ?? [])]
  }, [lpPositionQuery?.data])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [sorting, data])

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

  const { address } = useAccount()
  const { data: rewardsData } = useClaimableRewards({
    chainIds:
      positionData?.pool?.chainId && isMerklChainId(positionData?.pool?.chainId)
        ? [positionData?.pool?.chainId as MerklChainId]
        : [],
    account: address,
    enabled:
      isMerklChainId(positionData?.pool?.chainId as EvmChainId) &&
      Boolean(positionData),
  })

  const rewardsForChain =
    rewardsData?.[positionData?.pool.chainId as MerklChainId]

  return (
    <>
      <Card className="overflow-hidden dark:!bg-slate-800 !bg-slate-50">
        <Trending />
        <LPPositionsTableHeader />
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={lpPositionQuery?.isLoading}
          rowRenderer={rowRenderer}
          columns={columns}
          data={data}
          className="border-t-0 dark:!border-[#FFFFFF14] !border-[#00000014]"
          tableRowClassName="dark:!border-[#FFFFFF14] !border-[#00000014]"
        />
      </Card>
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
          <div className="flex  gap-4 px-3 mt-14 w-full">
            {positionData?.pool.protocol === SushiSwapProtocol.SUSHISWAP_V3 ? (
              <ClaimRewardsButton
                rewards={rewardsForChain}
                className={classNames('!rounded-full flex-auto !w-1/2')}
              />
            ) : null}
            <Button
              size="sm"
              variant="networks"
              className={classNames(
                'dark:!bg-[#FFFFFF]/[.12] dark:hover:!bg-[#fff]/[.18] dark:active:!bg-[#fff]/[.24]',
                '!rounded-full',
                positionData?.pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
                  ? 'w-1/2'
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
