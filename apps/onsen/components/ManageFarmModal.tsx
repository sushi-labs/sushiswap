import { Reward as RewardDTO, StakePosition as StakePositionDTO } from '@sushiswap/graph-client'
import { Button, Dialog, Typography } from '@sushiswap/ui'
import { Farm } from 'lib/Farm'
import { Reward } from 'lib/Reward'
import { StakePosition } from 'lib/StakePosition'
import { FC, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

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
  // const contract = useStakingContract(chainId)
  // const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  const { data: stakePositionDTO, isValidating: isValidatingStakePosition } = useSWR<StakePositionDTO>(
    `/onsen/api/user/${chainId}/${account?.address}/farm/${farm?.id}/stake-position`,
    fetcher
  )

  const { data: rewardsDTO, isValidating: isValidatingRewards } = useSWR<RewardDTO[]>(
    `/onsen/api/user/${chainId}/${account?.address}/farm/${farm?.id}/rewards`,
    fetcher
  )

  const stakePosition = useMemo(() => {
    if (chainId && !isValidatingStakePosition && stakePositionDTO) {
      return new StakePosition({ chainId, stake: stakePositionDTO })
    }
  }, [chainId, stakePositionDTO, isValidatingStakePosition])
  console.log(rewardsDTO?.length)

  const rewards = useMemo(() => {
    if (chainId && !isValidatingRewards && rewardsDTO) {
      return rewardsDTO.map((reward) => new Reward({ chainId, reward }))
    }
  }, [chainId, rewardsDTO, isValidatingRewards])

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
          {rewards?.map((reward, i) => (
            <Typography key={i}>{reward.claimableAmount.toExact()}</Typography>
          ))}

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
          {/* <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={isWritePending || selectedIncentives.length == 0}
            onClick={stakeAndSubscribe}
          >
            {isWritePending ? <Dots>{`Subscribing..`}</Dots> : 'Subscribe'}
          </Button> */}
        </Dialog.Content>
      </Dialog>
    </>
  )
}
