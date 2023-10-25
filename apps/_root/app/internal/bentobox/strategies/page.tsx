'use client'

import { ChainId } from '@sushiswap/chain'
import { Network } from '@sushiswap/ui/network'
import { Typography } from '@sushiswap/ui/typography'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { getStrategies } from './lib'

export default function BentoBoxStrategiesPage() {
  const { data } = useSWR('bentobox-strategies', () => getStrategies())
  const strategyChainIds = useMemo(
    () =>
      data?.reduce((acc, cur) => {
        acc.push(cur.chainId as ChainId)
        return acc
      }, [] as ChainId[]),
    [data]
  )

  const [selectedChainIds, setChainIds] = useState<ChainId[]>([])

  useEffect(() => {
    if (strategyChainIds) {
      setChainIds(strategyChainIds)
    }
  }, [strategyChainIds])

  const filteredStrategies = useMemo(
    () => data?.filter((el) => selectedChainIds.includes(el.chainId)),
    [data, selectedChainIds]
  )

  return (
    <div className="max-w-full px-4 py-12 mx-auto space-y-4 sm:px-6 lg:px-8">
      <Typography variant="hero" weight={600} className="text-slate-50">
        BentoBox Strategies
      </Typography>
      <>
        {strategyChainIds && (
          <Network.Selector
            networks={strategyChainIds}
            selectedNetworks={selectedChainIds}
            onChange={(selectedChainIds) => setChainIds(selectedChainIds)}
          />
        )}
      </>
      <div className="grid grid-cols-1 gap-5">
        {filteredStrategies?.map((strategy) => (
          <pre key={`${strategy.chainId}:${strategy.id}`} className="p-4 bg-slate-700 rounded-3xl">
            {JSON.stringify(strategy, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  )
}
