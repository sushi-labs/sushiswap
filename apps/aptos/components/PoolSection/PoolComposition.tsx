import { List } from '@sushiswap/ui/future/components/list/List'
import { FC } from 'react'

interface PoolCompositionProps {}

export const PoolComposition: FC<PoolCompositionProps> = ({}) => {
  return (
    <List>
      <div className="flex items-center justify-between">
        <List.Label>Pool Liquidity</List.Label>
        <List.Label>{}</List.Label>
      </div>
      <List.Control>
        {'' ? (
          <List.KeyValue flex title={``}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {}
                {}
                {''}
                <span className="text-gray-600 dark:text-slate-400">({})</span>
              </div>
            </div>
          </List.KeyValue>
        ) : '' ? (
          <List.KeyValue skeleton />
        ) : (
          <></>
        )}
        {'' ? (
          <List.KeyValue flex title={``}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {}
                {}
                {''}
                <span className="text-gray-600 dark:text-slate-400">({})</span>
              </div>
            </div>
          </List.KeyValue>
        ) : '' ? (
          <List.KeyValue skeleton />
        ) : (
          <></>
        )}
      </List.Control>
    </List>
  )
}
