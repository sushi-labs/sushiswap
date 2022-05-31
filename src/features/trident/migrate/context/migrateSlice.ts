import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Pair } from '@sushiswap/core-sdk'
import { AvailablePoolConfig } from 'app/components/Migrate/migrate-utils'
import { StandardSignatureData } from 'app/hooks/useERC20Permit'
import { TridentPool } from 'app/services/graph'
import { AppState } from 'app/state'

export enum MigrationSource {
  SUSHI_V2 = 'Sushi v2',
  QUICKSWAP = 'QuickSwap',
}

export interface v2Migration {
  v2Pair: Pair
  matchingTridentPool?: TridentPool
  poolToCreate?: AvailablePoolConfig
  slpPermit?: StandardSignatureData
}

interface stateProps {
  migrations: v2Migration[]
  tx?: string
}

const initialState: stateProps = {
  migrations: [],
}

export const migrateSlice = createSlice({
  name: 'tridentMigrations',
  initialState,
  reducers: {
    addOrRemoveMigration: (state, action: PayloadAction<{ add: boolean; migration: v2Migration }>) => {
      if (action.payload.add) {
        state.migrations.push(action.payload.migration)
      } else {
        state.migrations = state.migrations.filter(
          (m) => m.v2Pair.liquidityToken.address !== action.payload.migration.v2Pair.liquidityToken.address
        )
      }
    },
    editMigration: (state, action: PayloadAction<{ indexToReplace: number; migration: v2Migration }>) => {
      state.migrations[action.payload.indexToReplace] = action.payload.migration
    },
    addSLPPermit: (state, action: PayloadAction<StandardSignatureData>) => {
      const matchingMigration = state.migrations.find(
        (m) => m.v2Pair.liquidityToken.address === action.payload.tokenAddress
      )
      matchingMigration!.slpPermit = action.payload
    },
    setMigrationTxHash: (state, action: PayloadAction<string | undefined>) => {
      state.tx = action.payload
    },
    resetMigrationState: (state) => {
      state.migrations = []
      state.tx = undefined
    },
  },
})

export const { addOrRemoveMigration, editMigration, addSLPPermit, setMigrationTxHash, resetMigrationState } =
  migrateSlice.actions

export const selectTridentMigrations = (state: AppState) => state.tridentMigrations.migrations

export const selectMigrationTx = (state: AppState) => state.tridentMigrations.tx

export const selectLeftToChoose = createSelector(selectTridentMigrations, (migrations: v2Migration[]): number => {
  const selected = migrations.filter((m) => m.poolToCreate || m.matchingTridentPool).length
  return migrations.length - selected
})

export default migrateSlice.reducer
