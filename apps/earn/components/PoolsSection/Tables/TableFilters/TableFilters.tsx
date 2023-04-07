import { classNames } from '@sushiswap/ui'
import React, { FC } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { TableFiltersSearchToken } from './TableFiltersSearchToken'
import { Button } from '@sushiswap/ui/future/components/button'
import { TableFiltersNetwork } from './TableFiltersNetwork'

export const TableFilters: FC<{ showAllFilters?: boolean }> = ({ showAllFilters = false }) => {
  const { incentivizedOnly, setFilters, protocols } = usePoolFilters()

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
            onClick={() =>
              setFilters({
                protocols: protocols.includes('SUSHISWAP_V3')
                  ? protocols.filter((el) => el !== 'SUSHISWAP_V3')
                  : [...protocols, 'SUSHISWAP_V3'],
              })
            }
            size="sm"
            variant={protocols.includes('SUSHISWAP_V3') ? 'outlined' : 'empty'}
            color={protocols.includes('SUSHISWAP_V3') ? 'blue' : 'default'}
          >
            <span>🍣</span>{' '}
            <span>
              SushiSwap <sup>v3</sup>
            </span>
          </Button>
          <Button
            className="gap-2.5"
            onClick={() =>
              setFilters({
                protocols: protocols.includes('SUSHISWAP_V2')
                  ? protocols.filter((el) => el !== 'SUSHISWAP_V2')
                  : [...protocols, 'SUSHISWAP_V2'],
              })
            }
            size="sm"
            variant={protocols.includes('SUSHISWAP_V2') ? 'outlined' : 'empty'}
            color={protocols.includes('SUSHISWAP_V2') ? 'blue' : 'default'}
          >
            <span>🍣</span>{' '}
            <span>
              SushiSwap <sup>v2</sup>
            </span>
          </Button>

          <Button
            className="flex items-center gap-2.5"
            onClick={() =>
              setFilters({
                protocols: protocols.includes('BENTOBOX_STABLE_POOL')
                  ? protocols.filter((el) => el !== 'BENTOBOX_STABLE_POOL')
                  : [...protocols, 'BENTOBOX_STABLE_POOL'],
              })
            }
            size="sm"
            variant={protocols.includes('BENTOBOX_STABLE_POOL') ? 'outlined' : 'empty'}
            color={protocols.includes('BENTOBOX_STABLE_POOL') ? 'blue' : 'default'}
          >
            <span className="mt-1">🍱</span>
            <span>Stable</span>
          </Button>
          <Button
            className="flex items-center gap-2.5"
            onClick={() =>
              setFilters({
                protocols: protocols.includes('BENTOBOX_CLASSIC')
                  ? protocols.filter((el) => el !== 'BENTOBOX_CLASSIC')
                  : [...protocols, 'BENTOBOX_CLASSIC'],
              })
            }
            size="sm"
            variant={protocols.includes('BENTOBOX_CLASSIC') ? 'outlined' : 'empty'}
            color={protocols.includes('BENTOBOX_CLASSIC') ? 'blue' : 'default'}
          >
            <span className="mt-1">🍱</span>
            <span>Classic</span>
          </Button>
          <Button
            onClick={() => setFilters({ incentivizedOnly: !incentivizedOnly })}
            size="sm"
            variant={incentivizedOnly ? 'outlined' : 'empty'}
            color={incentivizedOnly ? 'blue' : 'default'}
            className="flex gap-2.5"
          >
            <span>🧑‍🌾</span> <span>Farms</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
