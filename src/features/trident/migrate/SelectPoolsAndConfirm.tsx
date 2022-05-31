import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import EXPORTS from '@sushiswap/trident/exports/all.json'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import { LoadingSpinner } from 'app/components/LoadingSpinner'
import { SelectTridentPoolPanel } from 'app/components/Migrate/SelectTridentPoolPanel'
import { migrateGridLayoutCss } from 'app/features/trident/migrate/AvailableToMigrate'
import {
  addSLPPermit,
  editMigration,
  MigrationSource,
  selectLeftToChoose,
  selectTridentMigrations,
} from 'app/features/trident/migrate/context/migrateSlice'
import { useExecuteTridentMigration } from 'app/features/trident/migrate/context/useExecuteTridentMigration'
import { MigrationTransactionModal } from 'app/features/trident/migrate/MigrationTransactionModal'
import { SlippageWidget } from 'app/features/trident/migrate/SlippageWidget'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useGetAllTridentPools } from 'app/services/graph/hooks/pools'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useTokenBalances } from 'app/state/wallet/hooks'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import Typography from '../../../components/Typography'

export const SelectPoolsAndConfirm: FC = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const selectedMigrations = useAppSelector(selectTridentMigrations)
  /* Need to select pools on previous page */
  if (selectedMigrations.length === 0) router.replace('/trident/migrate')
  const leftToSelect = useAppSelector(selectLeftToChoose)

  const { account, chainId } = useActiveWeb3React()

  const { data, error, isValidating } = useGetAllTridentPools({ chainId })

  const lpTokenAmounts = useTokenBalances(
    account ?? undefined,
    selectedMigrations.map((m) => m.v2Pair.liquidityToken)
  )
  const migrationContractAddress = chainId
    ? (EXPORTS as any)[chainId][0].contracts.TridentSushiRollCP.address
    : undefined

  const execute = useExecuteTridentMigration()

  return (
    <div>
      <MigrationTransactionModal />

      <div className="flex items-center gap-3">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {leftToSelect === 0 ? i18n._(t`All set ✅`) : i18n._(t`Pools left to select: ${leftToSelect}`)}
        </Typography>
        <LoadingSpinner active={isValidating} />
        {error && <span className="text-red">⚠️ Loading Error</span>}
      </div>
      {selectedMigrations.length > 0 && (
        <div className="flex flex-col">
          <div className={migrateGridLayoutCss}>
            {selectedMigrations.map((migration, i) => (
              <SelectTridentPoolPanel
                key={i}
                migration={migration}
                tridentPools={data ?? []}
                source={MigrationSource.SUSHI_V2}
                setFunc={(migration) => dispatch(editMigration({ indexToReplace: i, migration }))}
              />
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 mt-10 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {leftToSelect !== 0 ? (
          <Button disabled={true}>{i18n._(t`Pools left to select: ${leftToSelect}`)}</Button>
        ) : (
          <TridentApproveGate
            inputAmounts={Object.values(lpTokenAmounts)}
            tokenApproveOn={migrationContractAddress}
            onSLPPermit={(permit) => dispatch(addSLPPermit(permit))}
          >
            {({ loading, approved }) => {
              if (loading)
                return (
                  <Button disabled={true}>
                    {i18n._(t`Loading`)}
                    <Dots />
                  </Button>
                )

              if (approved)
                return (
                  <>
                    <Button color="gradient" onClick={() => execute()}>
                      {i18n._(t`Confirm Migration`)}
                    </Button>
                    <SlippageWidget />
                  </>
                )
            }}
          </TridentApproveGate>
        )}
        <div
          className="text-center cursor-pointer text-blue md:text-left md:mt-3"
          onClick={() => router.replace('/trident/migrate')}
        >
          {i18n._(t`← Previous Step`)}
        </div>
      </div>
    </div>
  )
}
