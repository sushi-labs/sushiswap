import type { EvmAddress, EvmCurrency } from 'sushi/evm'
import type { RfqWithdrawResponse } from '../useBladeWithdrawRequest'

export type WithdrawVariablesGetterArgs = {
  poolAddress: EvmAddress
  poolTokenAmountToBurn: string
  withdraw?: RfqWithdrawResponse
  token?: EvmCurrency
}
