import { PrivateTxState } from 'app/entities/SushiGuard'
import { TransactionDetails } from 'app/state/transactions/reducer'

export function isTxPending(tx?: TransactionDetails): boolean {
  if (!tx?.privateTx) return !tx?.receipt
  return tx?.privateTx?.state === PrivateTxState.CHECKING
}

export function isTxConfirmed(tx: TransactionDetails): boolean {
  return !isTxPending(tx)
}
