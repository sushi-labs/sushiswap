import type { EvmCurrency } from 'sushi/evm'
import type { RfqDepositResponse } from '../use-blade-deposit-request'

export type DepositVariablesGetterArgs = {
  deposit: RfqDepositResponse
  amounts: {
    token: EvmCurrency
    amount: string
  }[]
}
