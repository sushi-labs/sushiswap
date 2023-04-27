import { classNames } from '@sushiswap/ui'
import React, { FC, useCallback } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'
import { Button } from '@sushiswap/ui/future/components/button'
import { TableFiltersNetwork } from './TableFiltersNetwork'
import { Protocol } from '@sushiswap/client'

export const TableFilters: FC<{ showAllFilters?: boolean }> = ({ showAllFilters = false }) => {
  const { protocols, farmsOnly, setFilters } = usePoolFilters()

  const protocolHandler = useCallback(
    (item: Protocol) => {
      setFilters({
        protocols: protocols.includes(item) ? protocols.filter((el) => el !== item) : [...protocols, item],
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
      <div className="w-full h-px bg-gray-200 dark:bg-slate-200/5" />
      <div className="flex gap-4">
        <TableFiltersSearchToken />
        <TableFiltersNetwork />
      </div>
      <div className="w-full h-px bg-gray-200 dark:bg-slate-200/5" />
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={classNames(
            showAllFilters ? 'opacity-100' : 'opacity-40 pointer-events-none',
            'transition-opacity ease-in duration-150 flex gap-3 flex-wrap items-center'
          )}
        >
          <Button
            className="items-center gap-2.5"
            onClick={() => protocolHandler(Protocol.SUSHISWAP_V3)}
            size="sm"
            variant={protocols.includes(Protocol.SUSHISWAP_V3) ? 'outlined' : 'empty'}
            color={protocols.includes(Protocol.SUSHISWAP_V3) ? 'blue' : 'default'}
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
            variant={protocols.includes(Protocol.SUSHISWAP_V2) ? 'outlined' : 'empty'}
            color={protocols.includes(Protocol.SUSHISWAP_V2) ? 'blue' : 'default'}
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
            variant={protocols.includes(Protocol.BENTOBOX_STABLE) ? 'outlined' : 'empty'}
            color={protocols.includes(Protocol.BENTOBOX_STABLE) ? 'blue' : 'default'}
          >
            <span className="mt-1">🍱</span>
            <span>Stable</span>
          </Button>
          <Button
            className="flex items-center gap-2.5"
            onClick={() => protocolHandler(Protocol.BENTOBOX_CLASSIC)}
            size="sm"
            variant={protocols.includes(Protocol.BENTOBOX_CLASSIC) ? 'outlined' : 'empty'}
            color={protocols.includes(Protocol.BENTOBOX_CLASSIC) ? 'blue' : 'default'}
          >
            <span className="mt-1">🍱</span>
            <span>Classic</span>
          </Button>
          <Button
            onClick={() => farmsHandler()}
            size="sm"
            variant={farmsOnly ? 'outlined' : 'empty'}
            color={farmsOnly ? 'blue' : 'default'}
            className="flex gap-2.5"
          >
            <span>🧑‍🌾</span> <span>Farms</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
