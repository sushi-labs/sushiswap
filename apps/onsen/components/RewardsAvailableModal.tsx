import log from '@sushiswap/log'
import { Button, Dialog, Dots, Typography } from '@sushiswap/ui'
import { Incentive, TokenRepresentation } from 'features'
import { useStakingContract } from 'hooks/useStakingContract'
import { batchAction, subscribeAction } from 'lib/actions'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'

import type { KOVAN_STAKING_User as UserSubscriptions } from '../.graphclient'
import IncentiveTable from './IncentiveTable'
import { createToast } from './Toast'

interface RewardsAvailableModalProps {
  userSubscriptions: UserSubscriptions | undefined
  stakeTokens: TokenRepresentation[] | undefined
  chainId: number | undefined
  // abi: ContractInterface
  // address: string
  // fn: string
}

export const RewardsAvailableModal: FC<RewardsAvailableModalProps> = ({ userSubscriptions, stakeTokens, chainId }) => {
  const [open, setOpen] = useState(false)
  const { data: account } = useAccount()
  const [selectedIncentives, setSelectedIncentives] = useState<Incentive[]>([])
  const contract = useStakingContract(chainId)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  const unsubscribedIncentives = useMemo(() => {
    const subscribedFarms = userSubscriptions?.subscriptions?.map((sub) => sub.token.id)
    const filteredFarms = stakeTokens?.filter((stakeToken) => subscribedFarms?.includes(stakeToken.id))
    const subscribedIncentiveIds = userSubscriptions?.subscriptions?.map((sub) => sub.incentive.id)
    const filteredIncentives = filteredFarms
      ?.map((stakedToken) => stakedToken.incentives ?? [])
      .flat()
      .filter((incentive) => incentive != undefined && !subscribedIncentiveIds?.includes(incentive.id))
    return filteredIncentives?.map((incentive) => new Incentive({ incentive })) ?? []
  }, [userSubscriptions, stakeTokens])

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
      {unsubscribedIncentives.length ? (
        <div onClick={() => setOpen(true)}>
          You have new reward subscriptions available. Click to learn more and start earning more rewards!
        </div>
      ) : (
        <></>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5 !max-w-m">
          <Dialog.Header title={'New Rewards Available'} onClose={() => setOpen(false)} />
          <Typography>
            There are new reward tokens available for some of your farms. Select any or all of the following checkboxes
            and click ‘subscribe’ to start earning.
          </Typography>

          <Typography>Subscriptions: {Number(userSubscriptions?.activeSubscriptionCount)} / 6</Typography>

          <IncentiveTable
            incentives={unsubscribedIncentives}
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
