'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { NetworkSelector } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import React, { useMemo, useState } from 'react'
import { Chain, ChainId } from 'sushi/chain'
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
    [data],
  )

  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    ChainId.ETHEREUM,
  )
  const filteredStrategies = useMemo(
    () => data?.filter((el) => el.chainId === selectedChainId),
    [data, selectedChainId],
  )

  return (
    <div className="max-w-full px-4 py-12 mx-auto space-y-4 sm:px-6 lg:px-8">
      <p className="text-5xl font-semibold  text-slate-50">
        BentoBox Strategies
      </p>
      {strategyChainIds && (
        <NetworkSelector
          networks={strategyChainIds}
          selected={selectedChainId}
          onSelect={setSelectedChainId}
        >
          <Button variant="secondary" className="!font-medium">
            <NetworkIcon chainId={selectedChainId} width={20} height={20} />
            <div>{Chain.from(selectedChainId)?.name}</div>
            <ChevronDownIcon width={24} height={24} />
          </Button>
        </NetworkSelector>
      )}
      <div className="grid grid-cols-1 gap-5">
        {filteredStrategies?.map((strategy) => (
          <pre
            key={`${strategy.chainId}:${strategy.id}`}
            className="p-4 bg-slate-700 rounded-3xl"
          >
            {JSON.stringify(strategy, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  )
}
