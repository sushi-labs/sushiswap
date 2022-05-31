import { isWalletError, USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { AppDispatch } from 'app/state'
import { addPopup } from 'app/state/application/reducer'

export const missingMigrationDependencies = addPopup({
  content: {
    txn: {
      hash: '',
      success: false,
      summary: 'Missing dependencies needed for migration',
    },
  },
})

export const migrationExecuteError = (summary: string) =>
  addPopup({
    content: {
      txn: {
        hash: '',
        success: false,
        summary,
      },
    },
  })

export const handleMigrationError = (error: unknown, dispatch: AppDispatch) => {
  if (error instanceof Error) {
    dispatch(migrationExecuteError(error.message))
  } else if (typeof error === 'string') {
    dispatch(migrationExecuteError(error))
  } else if (isWalletError(error)) {
    if (error.code === USER_REJECTED_TX) return
    dispatch(migrationExecuteError(`${error.message} (code: ${error.code})`))
  } else {
    dispatch(migrationExecuteError('Error attempting migration'))
  }
  console.error(error)
}
