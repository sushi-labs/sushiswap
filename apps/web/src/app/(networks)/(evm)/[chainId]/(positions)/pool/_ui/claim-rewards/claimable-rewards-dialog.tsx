'use client'

import {
  Button,
  DataTableVirtual,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  MobileTable,
  useBreakpoint,
} from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import {
  DialogProvider,
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog'
import { ClaimableRewardsActionCell } from '~evm/_common/ui/claim-rewards/claimable-rewards-action-cell'
import { ClaimableRewardsAmountCell } from '~evm/_common/ui/claim-rewards/claimable-rewards-amount-cell'
import { ClaimableRewardsChainCell } from '~evm/_common/ui/claim-rewards/claimable-rewards-chain-cell'
import {
  REWARDS_AMOUNT_COLUMN,
  REWARDS_CHAIN_COLUMN,
  createRewardsActionColumn,
} from '~evm/_common/ui/claim-rewards/columns'
import { ReviewRewardsClaim } from './review-rewards-claim'

interface ClaimableRewardsDialogProps {
  rewards: ClaimableRewards[]
  isLoading: boolean
  isError: boolean
}

function renderMobileRow(
  row: Row<ClaimableRewards>,
  onClaim: (rewards: ClaimableRewards) => void,
): ReactNode {
  return (
    <dl className="flex flex-col gap-4 rounded-2xl border border-accent bg-secondary p-4 text-xs">
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Chain</dt>
        <dd>
          <ClaimableRewardsChainCell {...row} />
        </dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Rewards Amount</dt>
        <dd>
          <ClaimableRewardsAmountCell {...row} />
        </dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Action</dt>
        <dd>
          <ClaimableRewardsActionCell {...row} onClaim={onClaim} />
        </dd>
      </div>
    </dl>
  )
}

export function ClaimableRewardsDialog(
  props: ClaimableRewardsDialogProps,
): ReactNode {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Claim Rewards</Button>
      </DialogTrigger>
      <DialogContent className="md:!max-w-3xl" aria-describedby={undefined}>
        <DialogProvider>
          <ClaimableRewardsDialogContent {...props} />
        </DialogProvider>
      </DialogContent>
    </Dialog>
  )
}

function ClaimableRewardsDialogContent({
  rewards,
  isLoading,
  isError,
}: ClaimableRewardsDialogProps): ReactNode {
  const { isMd } = useBreakpoint('md')
  const { open: isReviewOpen, setOpen: setReviewOpen } = useDialog(
    DialogType.Review,
  )
  const { open: isConfirmOpen } = useDialog(DialogType.Confirm)
  // A rewards refresh can remove the row while its transaction is confirming.
  const [selectedRewards, setSelectedRewards] = useState<ClaimableRewards>()

  const onClaim = useCallback(
    (rewards: ClaimableRewards) => {
      setSelectedRewards(rewards)
      setReviewOpen(true)
    },
    [setReviewOpen],
  )

  useEffect(() => {
    if (!isReviewOpen && !isConfirmOpen) setSelectedRewards(undefined)
  }, [isReviewOpen, isConfirmOpen])

  const columns = useMemo(
    () => [
      REWARDS_CHAIN_COLUMN,
      REWARDS_AMOUNT_COLUMN,
      createRewardsActionColumn(onClaim),
    ],
    [onClaim],
  )
  const tableState = useMemo(
    () => ({
      pagination: { pageIndex: 0, pageSize: Math.max(rewards.length, 1) },
    }),
    [rewards.length],
  )

  return (
    <>
      <DialogHeader>
        <DialogTitle>Claimable Rewards ({rewards.length})</DialogTitle>
      </DialogHeader>
      {isError && !isLoading && rewards.length === 0 ? (
        <p role="alert" className="text-sm text-muted-foreground">
          Rewards unavailable
        </p>
      ) : isMd ? (
        <DataTableVirtual
          loading={isLoading}
          columns={columns}
          data={rewards}
          state={tableState}
          scrollClassName="max-h-[60dvh] scroll border-t-transparent"
          estimateSize={72}
        />
      ) : (
        <MobileTable
          sorting={[]}
          isLoading={isLoading}
          isExpandedOverride
          hideExpand
          rowRenderer={(row) => renderMobileRow(row, onClaim)}
          columns={columns}
          data={rewards}
          scrollClassName="max-h-[60dvh] !min-h-0 overflow-y-auto scroll"
        />
      )}
      {selectedRewards ? (
        <ReviewRewardsClaim rewards={selectedRewards} />
      ) : null}
    </>
  )
}
