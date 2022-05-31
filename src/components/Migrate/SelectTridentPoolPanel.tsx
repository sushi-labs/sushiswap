import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CreatePoolOption } from 'app/components/Migrate/CreatePoolOption'
import { ExistingPoolOption } from 'app/components/Migrate/ExistingPoolOption'
import { AvailablePoolConfig, matchV2PairWithTridentPools } from 'app/components/Migrate/migrate-utils'
import { PoolPanelAssetsLabel } from 'app/components/Migrate/PoolPanelAssetsLabel'
import { PoolValueEstimation } from 'app/components/Migrate/PoolValueEstimation'
import { MigrationSource, v2Migration } from 'app/features/trident/migrate/context/migrateSlice'
import { TridentPool } from 'app/services/graph'
import React, { FC, useMemo } from 'react'

interface PanelProps {
  migration: v2Migration
  source: MigrationSource
  setFunc: (updatedMigrationObj: v2Migration) => void
  tridentPools: TridentPool[]
}

export const SelectTridentPoolPanel: FC<PanelProps> = ({ migration, source, setFunc, tridentPools }) => {
  const { i18n } = useLingui()
  const { matches, availableToCreate } = useMemo(
    () => matchV2PairWithTridentPools(migration.v2Pair, tridentPools),
    [migration.v2Pair, tridentPools]
  )

  return (
    <div className="w-full border border-1 border-dark-700 rounded bg-dark-900">
      <div className="flex justify-between p-3 items-center rounded-t">
        <PoolPanelAssetsLabel pair={migration.v2Pair} />
        <div className="flex">
          <Button color="blue" variant="outlined" size="xs">
            {source}
          </Button>
        </div>
      </div>
      <PoolValueEstimation pair={migration.v2Pair} />
      <div className="m-3 text-high-emphesis">{i18n._(t`Select a Pool:`)}</div>
      {matches.map((pool, i) => (
        <ExistingPoolOption
          active={migration.matchingTridentPool?.address === pool.address}
          pool={pool}
          key={i}
          onClick={() => setFunc({ ...migration, matchingTridentPool: pool, poolToCreate: undefined })}
        />
      ))}
      {availableToCreate.length > 0 && (
        <CreatePoolOption
          selectedPoolConfig={migration.poolToCreate}
          allPoolConfigs={availableToCreate}
          onClick={(poolToCreate: AvailablePoolConfig) =>
            setFunc({ ...migration, poolToCreate, matchingTridentPool: undefined })
          }
        />
      )}
    </div>
  )
}
