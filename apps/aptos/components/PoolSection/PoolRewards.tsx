import { List } from '@sushiswap/ui/future/components/list/List'
import { FC } from 'react'
import { formatNumber } from 'utils/utilFunctions'

export const PoolRewards: FC<{ isFarm: boolean; rewardsPerDay: number }> = ({ isFarm, rewardsPerDay }) => {
  if (!isFarm) return <></>
  return (
    <List>
      <div className="flex items-center justify-between">
        <List.Label>Pool Rewards</List.Label>
        <List.Label>Reward APR: {'0.00%'}</List.Label>
      </div>
      <List.Control>
        <List.KeyValue flex title={`SUSHI`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64,q_auto/tokens/137/0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a.jpg"
                className="rounded-full"
                height={20}
                width={20}
                alt=""
              />
              {rewardsPerDay} SUSHI per day
            </div>
          </div>
        </List.KeyValue>
      </List.Control>
    </List>
  )
}
