import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { approveSLPAction, batchAction } from 'app/features/trident/actions'
import { handleMigrationError, missingMigrationDependencies } from 'app/features/trident/migrate/context/errorPopups'
import { selectTridentMigrations, setMigrationTxHash } from 'app/features/trident/migrate/context/migrateSlice'
import {
  getSwapFee,
  getTwapSelection,
  tridentMigrateAction,
} from 'app/features/trident/migrate/context/tridentMigrateAction'
import { useTridentMigrationContract, useTridentRouterContract } from 'app/hooks'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useConstantProductPools } from 'app/hooks/useConstantProductPools'
import { useMultipleTotalSupply } from 'app/hooks/useTotalSupply'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useTokenBalances } from 'app/state/wallet/hooks'

export const useExecuteTridentMigration = () => {
  const { i18n } = useLingui()
  const { library, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()

  const migrationContract = useTridentMigrationContract()
  const router = useTridentRouterContract()
  const selectedMigrations = useAppSelector(selectTridentMigrations)

  const v2LpTokenAmounts = useTokenBalances(
    account ?? undefined,
    selectedMigrations.map((m) => m.v2Pair.liquidityToken)
  )
  const selectedTridentPools = useConstantProductPools(
    selectedMigrations.map((m) => [m.v2Pair.token0, m.v2Pair.token1, getSwapFee(m), getTwapSelection(m)])
  )
  const v2PoolsSupplies = useMultipleTotalSupply(selectedMigrations.map((m) => m.v2Pair.liquidityToken))
  const tridentPoolsSupplies = useMultipleTotalSupply(selectedTridentPools.map((t) => t.pool?.liquidityToken))

  const { rebases, loading: rebasesLoading } = useBentoRebases([
    ...selectedTridentPools.flatMap((t) => [t.pool?.token0, t.pool?.token1]),
  ])

  return async () => {
    if (
      !account ||
      !library ||
      !migrationContract ||
      !router ||
      !Object.keys(v2LpTokenAmounts).length ||
      !v2LpTokenAmounts ||
      rebasesLoading
    ) {
      dispatch(missingMigrationDependencies)
      return
    }

    try {
      const approvalActions = selectedMigrations
        .filter((m) => m.slpPermit)
        .map((m) => approveSLPAction({ router, signatureData: m.slpPermit }))

      const migrateActions = selectedMigrations.map((m, i) => {
        const tPool = selectedTridentPools[i].pool
        return tridentMigrateAction({
          contract: migrationContract,
          migration: m,
          v2LpTokenAmount: (v2LpTokenAmounts as Record<string, CurrencyAmount<Token>>)[m.v2Pair.liquidityToken.address],
          v2PoolTotalSupply: v2PoolsSupplies[m.v2Pair.liquidityToken.address],
          selectedTridentPool: selectedTridentPools[i],
          tridentPoolSupply: tPool ? tridentPoolsSupplies[tPool?.liquidityToken.address] : undefined,
          rebases: tPool ? [rebases[tPool.token0.address], rebases[tPool.token1.address]] : [undefined, undefined],
        })
      })

      const tx = await library.getSigner().sendTransaction({
        from: account,
        to: migrationContract.address,
        data: batchAction({
          contract: migrationContract,
          actions: [...approvalActions, ...migrateActions],
        }),
        value: '0x0',
      })

      dispatch(setMigrationTxHash(tx.hash))
      addTransaction(tx, { summary: i18n._(t`Migrating ${selectedMigrations.length} LP tokens`) })
    } catch (error) {
      handleMigrationError(error, dispatch)
    }
  }
}
