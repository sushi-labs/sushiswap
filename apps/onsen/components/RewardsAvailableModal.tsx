import log from '@sushiswap/log'
import { Button, Dialog, Dots, Typography } from '@sushiswap/ui'
import { Incentive } from 'features'
import { Farm } from 'features/onsen/context/Farm'
import { batchAction, subscribeAction } from 'lib/actions'
import { useStakingContract } from 'lib/hooks/useStakingContract'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'

import IncentiveTable from './IncentiveTable'
import { createToast } from './Toast'

interface RewardsAvailableModalProps {
  farms: Farm[] | undefined
  chainId: number | undefined
}

export const RewardsAvailableModal: FC<RewardsAvailableModalProps> = ({ farms, chainId }) => {
  const [open, setOpen] = useState(false)
  const { data: account } = useAccount()
  const [selectedIncentives, setSelectedIncentives] = useState<Incentive[]>([])
  const contract = useStakingContract(chainId)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  const incentives = useMemo(() => {
    return (
      farms
        ?.map((farm) => farm.incentives)
        .flat()
        .filter((incentive) => !incentive.isSubscribed) ?? []
    )
  }, [farms])

  const stakeAndSubscribe = useCallback(async () => {
    if (!account) return

    const actions = selectedIncentives.map((incentive) => subscribeAction(contract, incentive.id))

    try {
      const data = await sendTransactionAsync({
        request: {
          from: account?.address,
          to: contract?.address,
          data: batchAction({ contract, actions }),
        },
      })

      createToast({
        title: 'Create stream',
        description: `You have successfully created a stream`,
        promise: data.wait(),
      })
    } catch (e: any) {
      // setError(e.message)

      log.tenderly({
        chainId: chainId,
        from: account.address,
        to: contract.address,
        data: batchAction({ contract, actions }),
      })
    }
  }, [account, sendTransactionAsync, chainId, contract, selectedIncentives])

  if (!account) return <></>
  return (
    <>
      {incentives.length ? (
        <div onClick={() => setOpen(true)}>
          You have new reward subscriptions available. Click to learn more and start earning more rewards!
        </div>
      ) : (
        <></>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5">
          <Dialog.Header title={'New Rewards Available'} onClose={() => setOpen(false)} />
          <Typography>
            There are new reward tokens available for some of your farms. Select any or all of the following checkboxes
            and click ‘subscribe’ to start earning.
          </Typography>

          {/* <Typography>Subscriptions: {Number(userSubscriptions?.activeSubscriptionCount)} / 6</Typography> */}
          {/* // TODO: fix sub count, not correct. should be subscriptions to the current farm/stakeToken */}

          <IncentiveTable
            incentives={incentives}
            chainId={chainId}
            loading={false}
            setSelectedRows={setSelectedIncentives}
            placeholder="No subscriptions available"
          />
          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={isWritePending || selectedIncentives.length == 0}
            onClick={stakeAndSubscribe}
          >
            {isWritePending ? <Dots>{`Subscribing..`}</Dots> : 'Subscribe'}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
