import React, { FC, useCallback } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'
import { Button } from '@sushiswap/ui/future/components/button'
import { TableFiltersNetwork } from './TableFiltersNetwork'
import { Protocol } from '@sushiswap/client'

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
            <Button
              className="items-center gap-2.5"
              onClick={() => protocolHandler(Protocol.SUSHISWAP_V3)}
              size="sm"
              variant="outlined"
              color={protocols?.includes(Protocol.SUSHISWAP_V3) ? 'blue' : 'default'}
            >
              <span>🍣</span>{' '}
              <span>
                SushiSwap <sup>v3</sup>
              </span>
            </Button>
            <Button
              className="gap-2.5"
              onClick={() => protocolHandler(Protocol.SUSHISWAP_V2)}
              size="sm"
              variant="outlined"
              color={protocols?.includes(Protocol.SUSHISWAP_V2) ? 'blue' : 'default'}
            >
              <span>🍣</span>{' '}
              <span>
                SushiSwap <sup>v2</sup>
              </span>
            </Button>

            <Button
              className="flex items-center gap-2.5"
              onClick={() => protocolHandler(Protocol.BENTOBOX_STABLE)}
              size="sm"
              variant="outlined"
              color={protocols?.includes(Protocol.BENTOBOX_STABLE) ? 'blue' : 'default'}
            >
              <span className="mt-1">🍱</span>
              <span>Trident Stable</span>
            </Button>
            <Button
              className="flex items-center gap-2.5"
              onClick={() => protocolHandler(Protocol.BENTOBOX_CLASSIC)}
              size="sm"
              variant="outlined"
              color={protocols?.includes(Protocol.BENTOBOX_CLASSIC) ? 'blue' : 'default'}
            >
              <span className="mt-1">🍱</span>
              <span>Trident Classic</span>
            </Button>
            <Button
              onClick={() => farmsHandler()}
              size="sm"
              variant="outlined"
              color={farmsOnly ? 'blue' : 'default'}
              className="flex gap-2.5"
            >
              <span>🧑‍🌾</span> <span>Farms</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
