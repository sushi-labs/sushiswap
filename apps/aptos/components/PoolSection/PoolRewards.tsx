import { List } from '@sushiswap/ui/future/components/list/List'
import { FC } from 'react'

export const PoolRewards: FC<{ isFarm: boolean }> = ({ isFarm }) => {
  if (!isFarm) return <></>
  return (
    <List>
      <div className="flex items-center justify-between">
        <List.Label>Pool Rewards</List.Label>
        <List.Label>Reward APR: {'0.00%'}</List.Label>
      </div>
      <List.Control>
        {
          <List.KeyValue key={``} flex title={`${''}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">{}per day</div>
            </div>
          </List.KeyValue>
        }
      </List.Control>
    </List>
  )
}
