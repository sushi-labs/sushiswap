'use client'

import { FC } from 'react'
import { useTrade } from '../../lib/useTrade'
import { Drawer } from '@sushiswap/ui13/components/drawer'
import { List } from '@sushiswap/ui13/components/list/List'

export const TradeRoute: FC = () => {
  const { data: trade } = useTrade()

  return (
    <Drawer.Root>
      <Drawer.Button>
        <button className="text-sm text-blue font-semibold">View Route</button>
      </Drawer.Button>
      <Drawer.Panel>
        {trade?.route && trade?.route.length > 4 && (
          <div className="w-full px-3 flex flex-col gap-1 pt-5">
            <List>
              <List.Label className="text-sm">Route</List.Label>
              <List.Control>
                <List.KeyValue title={trade?.route[0].split(':')[0]}>{trade?.route[0].split(':')[1]}</List.KeyValue>
                <List.KeyValue title="Input">{trade?.route[1].split(':')[1]}</List.KeyValue>
                <List.KeyValue title="Output">{trade?.route[trade?.route.length - 2].split(':')[1]}</List.KeyValue>
              </List.Control>
            </List>
            <List className="!pt-6">
              <List.Label className="text-sm">Path</List.Label>
              <List.Control>
                {trade?.route.slice(2, -2).map((s, i) => (
                  <div key={i} className="py-3 px-4 text-xs font-medium text-gray-600 dark:text-slate-400">
                    {s}
                  </div>
                ))}
              </List.Control>
            </List>
          </div>
        )}
      </Drawer.Panel>
    </Drawer.Root>
  )
}
