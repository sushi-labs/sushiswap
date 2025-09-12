import { CurrencyInput } from './Currency'
import { EnsInput } from './ens'

export interface Web3Input {
  Currency: typeof CurrencyInput
  Ens: typeof EnsInput
}

export const Web3Input: Web3Input = {
  Currency: CurrencyInput,
  Ens: EnsInput,
}
