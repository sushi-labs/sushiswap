import { FC } from 'react'

import { CurrencyInput, CurrencyInputProps } from './Currency'
import { EnsInput, EnsInputProps } from './Ens'

interface Web3Input {
  Ens: FC<EnsInputProps>
  Currency: FC<CurrencyInputProps>
}

export const Web3Input: Web3Input = {
  Ens: EnsInput,
  Currency: CurrencyInput,
}
