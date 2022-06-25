import { Stake as StakeDTO } from '@sushiswap/graph-client'
import log from '@sushiswap/log'
import { Button, Dialog, Dots, Typography } from '@sushiswap/ui'
import { batchAction, subscribeAction } from 'lib/actions'
import { Farm } from 'lib/Farm'
import { useStakingContract } from 'lib/hooks/useStakingContract'
import { Incentive } from 'lib/Incentive'
import { StakePosition } from 'lib/StakePosition'
import { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccount, useSendTransaction } from 'wagmi'

import { createToast } from './Toast'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

interface ManageFarmModalProps {
  farm: Farm | undefined
  // liquidity:
  chainId: number | undefined
}

export const ManageFarmModal: FC<ManageFarmModalProps> = ({ farm, chainId }) => {
  const [open, setOpen] = useState(false)
  const { data: account } = useAccount()
  const [selectedIncentives, setSelectedIncentives] = useState<Incentive[]>([])
  const contract = useStakingContract(chainId)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  const { data: stakePositionDTO, isValidating: isValidatingStakePosition } = useSWR<StakeDTO>(
    `/onsen/api/user/${chainId}/${account?.address}/farm/${farm?.id}/stake-position`,
    fetcher
  )

  const stakePosition = useMemo(() => {
    if (chainId && !isValidatingStakePosition && stakePositionDTO) {
      return new StakePosition({ chainId, stake: stakePositionDTO })
    }
  }, [chainId, stakePositionDTO])

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
        title: 'Subscribe',
        description: `You have successfully subscribed to the following rewards: ${selectedIncentives
          .map((incentive) => incentive.rewardsRemaining.currency.symbol)
          .join(', ')}`,
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
      {farm ? (
        <Button variant="filled" color="gradient" fullWidth onClick={() => setOpen(true)}>
          {' '}
          Manage{' '}
        </Button>
      ) : (
        <></>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5">
          <Dialog.Header title={'Your position and rewards'} onClose={() => setOpen(false)} />
          <Typography>{`${stakePosition?.amount.toExact()} ${stakePosition?.amount.currency.symbol}`}</Typography>

          {/* <Typography>Subscriptions: {Number(userSubscriptions?.activeSubscriptionCount)} / 6</Typography> */}
          {/* // TODO: fix sub count, not correct. should be subscriptions to the current farm/stakeToken */}
          {/* {TODO: new incentive table} */}
          {/* <IncentiveTable
            incentives={farm?.incentives ?? []}
            chainId={chainId}
            loading={false}
            setSelectedRows={setSelectedIncentives}
            placeholder="No subscriptions available"
          /> */}
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
