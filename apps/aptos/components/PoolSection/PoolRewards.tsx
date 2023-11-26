import { List } from '@sushiswap/ui/future/components/list/List'
import { FC } from 'react'

export const PoolRewards: FC<{ isFarm: boolean; rewardsPerDay: string }> = ({ isFarm, rewardsPerDay }) => {
  if (!isFarm) return <></>
  return (
    <List>
      <div className="flex items-center justify-between">
        <List.Label>Pool Rewards</List.Label>
        <List.Label>Reward APR: {'0.00%'}</List.Label>
      </div>
      <List.Control>
        <List.KeyValue flex title={'APT'}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                src="https://cryptototem.com/wp-content/uploads/2022/08/aptos-logo.jpg"
                className="rounded-full"
                height={20}
                width={20}
                alt=""
              />
              {rewardsPerDay} APT per day
            </div>
          </div>
        </List.KeyValue>
      </List.Control>
    </List>
  )
}
