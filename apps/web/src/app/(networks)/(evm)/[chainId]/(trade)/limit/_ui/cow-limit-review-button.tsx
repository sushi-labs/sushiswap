'use client'

import { Button } from '@sushiswap/ui'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { getCowSpender } from 'src/lib/swap/cow/order'
import { DialogType, useDialog } from 'src/lib/transaction-dialog'
import { Checker } from 'src/lib/wagmi/systems/checker'
import type { EvmAddress, EvmCurrency } from 'sushi/evm'
import {
  useCowApprovalAmount,
  useCowSellRequirement,
} from './use-cow-sell-amounts'

export function CowLimitReviewButton({
  chainId,
  owner,
  sell,
  sellAmount,
  replacedUid,
  loading,
  disabled,
  onReview,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress | undefined
  sell: EvmCurrency | undefined
  sellAmount: bigint | undefined
  replacedUid: string | undefined
  loading: boolean
  disabled: boolean
  // Resolves whether the order is ready for the review dialog.
  onReview(): Promise<boolean>
}): React.JSX.Element {
  const { setOpen } = useDialog(DialogType.Review)
  const required = useCowSellRequirement(sell, sellAmount)

  const approval = useCowApprovalAmount({
    chainId,
    owner,
    sell,
    sellAmount,
    replacedUid,
  })

  return (
    <Checker.Connect namespace="evm">
      <Checker.Network chainId={chainId}>
        <Checker.Amounts chainId={chainId} amount={required}>
          <Checker.ApproveERC20
            id="approve-erc20"
            amount={approval}
            contract={getCowSpender(chainId)}
          >
            <Button
              fullWidth
              size="xl"
              loading={loading}
              disabled={disabled}
              onClick={async () => {
                if (await onReview()) setOpen(true)
              }}
            >
              Review {replacedUid ? 'changes' : 'limit order'}
            </Button>
          </Checker.ApproveERC20>
        </Checker.Amounts>
      </Checker.Network>
    </Checker.Connect>
  )
}
