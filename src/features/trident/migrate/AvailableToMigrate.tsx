import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { LoadingSpinner } from 'app/components/LoadingSpinner'
import { SelectPairMigratePanel } from 'app/components/Migrate/SelectPairMigratePanel'
import {
  addOrRemoveMigration,
  MigrationSource,
  selectTridentMigrations,
} from 'app/features/trident/migrate/context/migrateSlice'
import { useV2PairsWithLiquidity } from 'app/features/trident/migrate/context/useV2PairsWithLiquidity'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import Typography from '../../../components/Typography'

export const migrateGridLayoutCss = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'

export const AvailableToMigrate: FC = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const { pairs, loading } = useV2PairsWithLiquidity()

  const dispatch = useAppDispatch()
  const selectedMigrations = useAppSelector(selectTridentMigrations)

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {i18n._(t`Available to Migrate`)}
          </Typography>
          <LoadingSpinner active={loading} />
        </div>
        {!account && <div>{i18n._(t`Connect to your wallet first ↗️`)}</div>}
        {account && pairs.length === 0 && !loading && (
          <>
            <div>{i18n._(t`You have no pools available for migration`)}</div>
            <Button className="w-max" size="sm" onClick={() => router.push(`/account/${account}`)}>
              {i18n._(t`Go to your wallet`)}
            </Button>
          </>
        )}
      </div>
      {pairs.length > 0 && (
        <div className="flex flex-col">
          <div className={migrateGridLayoutCss}>
            {pairs.map((pair, i) => {
              return (
                <SelectPairMigratePanel
                  key={i}
                  pair={pair}
                  source={MigrationSource.SUSHI_V2} // TODO: Needs support for Uniswap, Quickswap, etc
                  setFunc={(add, migration) => dispatch(addOrRemoveMigration({ add, migration }))}
                  checkedState={selectedMigrations.some(
                    (m) => m.v2Pair.liquidityToken.address === pair.liquidityToken.address
                  )}
                />
              )
            })}
          </div>
          <Button
            className="self-center w-full mt-6 md:w-96"
            color={selectedMigrations.length ? 'gradient' : 'gray'}
            disabled={Boolean(!selectedMigrations.length)}
            onClick={() => router.push('/trident/migrate/confirm')}
          >
            {selectedMigrations.length === 1
              ? i18n._(t`Migrate Pool`)
              : selectedMigrations.length > 1
              ? i18n._(t`Migrate Pools`)
              : i18n._(t`Select liquidity positions to migrate`)}
          </Button>
        </div>
      )}
    </div>
  )
}
