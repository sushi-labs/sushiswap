import { Protocol } from '@sushiswap/client'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC, useCallback } from 'react'

import { ChainFilter, SearchFilter, useFilters } from '../../Filters'

export const PoolFilters: FC = () => {
  const { poolProtocols: protocols, isWhitelisted, setFilters } = useFilters()

  const protocolHandler = useCallback(
    (item: Protocol) => {
      const newProtocols = protocols?.includes(item)
        ? protocols.filter((el) => el !== item)
        : [...(protocols || []), item]

      setFilters({
        poolProtocols: newProtocols.length === 0 ? undefined : newProtocols,
      })
    },
    [protocols, setFilters]
  )

  const whitelistedHandler = useCallback(() => {
    setFilters({
      isWhitelisted: !isWhitelisted,
    })
  }, [isWhitelisted, setFilters])

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex gap-4">
        <SearchFilter />
        <ChainFilter availableChainIds={SUPPORTED_CHAIN_IDS} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Toggle
            onPressedChange={() => protocolHandler(Protocol.SUSHISWAP_V3)}
            size="sm"
            pressed={Boolean(protocols?.includes(Protocol.SUSHISWAP_V3))}
          >
            <span>🍣</span>{' '}
            <span>
              SushiSwap <sup>v3</sup>
            </span>
          </Toggle>
          <Toggle
            onPressedChange={() => protocolHandler(Protocol.SUSHISWAP_V2)}
            size="sm"
            pressed={Boolean(protocols?.includes(Protocol.SUSHISWAP_V2))}
          >
            <span>🍣</span>{' '}
            <span>
              SushiSwap <sup>v2</sup>
            </span>
          </Toggle>

          <Toggle
            onPressedChange={() => protocolHandler(Protocol.BENTOBOX_STABLE)}
            size="sm"
            pressed={Boolean(protocols?.includes(Protocol.BENTOBOX_STABLE))}
          >
            <span className="mt-1">🍱</span>
            <span>Trident Stable</span>
          </Toggle>
          <Toggle
            onPressedChange={() => protocolHandler(Protocol.BENTOBOX_CLASSIC)}
            size="sm"
            pressed={Boolean(protocols?.includes(Protocol.BENTOBOX_CLASSIC))}
          >
            <span className="mt-1">🍱</span>
            <span>Trident Classic</span>
          </Toggle>
          {process.env.NODE_ENV !== 'production' && (
            <Toggle onPressedChange={() => whitelistedHandler()} size="sm" pressed={isWhitelisted}>
              Whitelisted
            </Toggle>
          )}
        </div>
      </div>
    </div>
  )
}
