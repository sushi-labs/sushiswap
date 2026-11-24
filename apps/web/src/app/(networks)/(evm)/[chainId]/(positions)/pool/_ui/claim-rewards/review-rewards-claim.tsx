import {
  Button,
  CardCurrencyAmountItem,
  CardGroup,
  CardItem,
  CardLabel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dots,
} from '@sushiswap/ui'
import { type ReactNode, useRef, useState } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import {
  DialogConfirm,
  DialogReview,
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog'
import { useClaimRewards } from 'src/lib/wagmi/hooks/rewards/hooks/use-claim-rewards'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { type TxHashFor, formatUSD } from 'sushi'
import { type MerklChainId, getEvmChainById } from 'sushi/evm'
import { useConnection } from 'wagmi'

interface ClaimTransaction {
  hash: TxHashFor<MerklChainId>
  status: 'pending' | 'success' | 'error'
}

export function ReviewRewardsClaim({
  rewards,
}: {
  rewards: ClaimableRewards
}): ReactNode {
  const { chainId } = rewards
  const { address } = useConnection()
  const { open: isReviewOpen, confirm } = useDialog(DialogType.Review)
  const [transaction, setTransaction] = useState<ClaimTransaction>()
  const claimButton = useRef<HTMLButtonElement>(null)
  const isClaimAccount =
    Boolean(address) &&
    address?.toLowerCase() === rewards.claimArgs[0][0]?.toLowerCase()

  const { isPending, write } = useClaimRewards({
    rewards,
    enabled: isReviewOpen && isClaimAccount,
    onRewardsSubmitted: (hash, receipt) => {
      if (!claimButton.current) return

      setTransaction({ hash, status: 'pending' })
      confirm()
      void receipt.then(
        () => setTransaction({ hash, status: 'success' }),
        () => setTransaction({ hash, status: 'error' }),
      )
    },
  })

  return (
    <>
      <DialogReview>
        {() => (
          <DialogContent className="max-h-[85dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Claim Rewards</DialogTitle>
              <DialogDescription>
                On {getEvmChainById(chainId).name}
              </DialogDescription>
            </DialogHeader>
            <CardGroup>
              <CardItem
                flex
                title="Total Value"
                className="rounded-2xl border border-accent bg-secondary p-4"
              >
                {formatUSD(rewards.totalRewardsUSD)}
              </CardItem>
              <CardGroup className="rounded-2xl border border-accent bg-secondary p-4">
                <CardLabel>You'll receive</CardLabel>
                {Object.values(rewards.rewardAmounts).map((amount) => {
                  const usd =
                    rewards.rewardAmountsUSD[
                      amount.currency.wrap().address.toLowerCase()
                    ]

                  return (
                    <CardCurrencyAmountItem
                      key={amount.currency.id}
                      amount={amount}
                      fiatValue={usd ? formatUSD(usd) : undefined}
                      unwrap={false}
                    />
                  )
                })}
              </CardGroup>
            </CardGroup>
            <DialogFooter>
              <Connect namespace="evm" fullWidth>
                <Network chainId={chainId} fullWidth>
                  <Button
                    ref={claimButton}
                    type="button"
                    size="xl"
                    fullWidth
                    loading={isPending}
                    disabled={!isClaimAccount || !write}
                    onClick={() => {
                      if (isClaimAccount) void write?.()
                    }}
                  >
                    {isPending ? <Dots>Confirm Claim</Dots> : 'Claim'}
                  </Button>
                </Network>
              </Connect>
            </DialogFooter>
          </DialogContent>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={transaction?.status ?? 'pending'}
        testId="close-claim-rewards"
        txHash={transaction?.hash}
        successMessage="You successfully claimed your rewards"
      />
    </>
  )
}
