import type { EvmAddress, EvmCurrency } from 'sushi/evm'
import type { RfqWithdrawResponse } from '../use-blade-withdraw-request'

export type WithdrawVariablesGetterArgs = {
  poolAddress: EvmAddress
  poolTokenAmountToBurn: string
  withdraw?: RfqWithdrawResponse
  token?: EvmCurrency
}
