import { Protocol } from '@sushiswap/client'
import { Toggle } from '@sushiswap/ui/components/toggle'
import React, { FC, useCallback } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { TableFiltersNetwork } from './TableFiltersNetwork'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'

export const TableFilters: FC<{ showCategories?: boolean }> = ({ showCategories = true }) => {
  const { protocols, farmsOnly, setFilters } = usePoolFilters()

  const protocolHandler = useCallback(
    (item: Protocol) => {
      const newProtocols = protocols?.includes(item)
        ? protocols.filter((el) => el !== item)
        : [...(protocols || []), item]

      setFilters({
        protocols: newProtocols.length === 0 ? undefined : newProtocols,
      })
    },
    [protocols, setFilters]
  )

  const farmsHandler = useCallback(() => {
    setFilters({
      farmsOnly: !farmsOnly,
    })
  }, [farmsOnly, setFilters])

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex gap-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork />
      </div>
      {showCategories && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-3 flex-wrap items-center">
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
            <Toggle onPressedChange={() => farmsHandler()} size="sm" pressed={Boolean(farmsOnly)}>
              <span>🧑‍🌾</span> <span>Farms</span>
            </Toggle>
          </div>
        </div>
      )}
    </div>
  )
}
