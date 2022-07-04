import {
  Reward as RewardDTO,
  StakePosition as StakePositionDTO,
  Transaction as TransactionDTO,
} from '@sushiswap/graph-client'
import { Button, Dialog, Typography } from '@sushiswap/ui'
import { Farm } from 'lib/Farm'
import { Reward } from 'lib/Reward'
import { StakePosition } from 'lib/StakePosition'
import { Transaction } from 'lib/Transaction'
import { FC, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

interface ManageFarmModalProps {
  farm: Farm | undefined
  chainId: number | undefined
}

export const ManageFarmModal: FC<ManageFarmModalProps> = ({ farm, chainId }) => {
  const [open, setOpen] = useState(false)
  const { data: account } = useAccount()

  const { data: stakePositionDTO, isValidating: isValidatingStakePosition } = useSWR<StakePositionDTO>(
    `/onsen/api/user/${chainId}/${account?.address}/farm/${farm?.id}/stake-position`,
    fetcher
  )

  const { data: rewardsDTO, isValidating: isValidatingRewards } = useSWR<RewardDTO[]>(
    `/onsen/api/user/${chainId}/${account?.address}/farm/${farm?.id}/rewards`,
    fetcher
  )

  const { data: transactionsDTO, isValidating: isValidatingTransactions } = useSWR<TransactionDTO[]>(
    `/onsen/api/user/${chainId}/${account?.address}/farm/${farm?.id}/transactions`,
    fetcher
  )
  // TODO: merge these three requests to one

  const stakePosition = useMemo(() => {
    if (chainId && !isValidatingStakePosition && stakePositionDTO) {
      return new StakePosition({ chainId, stake: stakePositionDTO })
    }
  }, [chainId, stakePositionDTO, isValidatingStakePosition])

  const rewards = useMemo(() => {
    if (chainId && !isValidatingRewards && rewardsDTO && stakePositionDTO) {
      return rewardsDTO.map((reward) => new Reward({ stakePosition: stakePositionDTO, chainId, reward }))
    }
  }, [chainId, rewardsDTO, isValidatingRewards, stakePositionDTO])

  const transactions = useMemo(() => {
    if (chainId && !isValidatingTransactions && transactionsDTO) {
      return transactionsDTO.map((transaction) => new Transaction(transaction, chainId))
    }
  }, [chainId, transactionsDTO, isValidatingTransactions])

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

          <Typography variant="xl" weight={700} className="text-slate-100">
            Your deposits
          </Typography>
          <Typography>{`${stakePosition?.amount.toExact()} ${stakePosition?.amount.currency.symbol}`}</Typography>

          <Typography variant="xl" weight={700} className="text-slate-100">
            Your rewards
          </Typography>
          {rewards?.map((reward, i) => (
            <Typography key={i}>{`${reward.claimableAmount.toExact()} ${
              reward.claimableAmount.currency.symbol
            }`}</Typography>
          ))}

          <Typography variant="xl" weight={700} className="text-slate-100">
            Transactions
          </Typography>
          {transactions?.map((transaction, i) => (
            <Typography key={i}>{`${transaction.status} ${transaction.amount.toExact()} ${
              transaction.token.symbol
            }`}</Typography>
          ))}
        </Dialog.Content>
      </Dialog>
    </>
  )
}
