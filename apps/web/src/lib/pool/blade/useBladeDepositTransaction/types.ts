import type { EvmCurrency } from 'sushi/evm'
import type { RfqDepositResponse } from '../useBladeDepositRequest'

export type DepositVariablesGetterArgs = {
  deposit: RfqDepositResponse
  amounts: {
    token: EvmCurrency
    amount: string
  }[]
}
