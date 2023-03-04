import { FC } from 'react'

import { CurrencyInput, CurrencyInputProps } from './Currency'

interface Web3Input {
  Currency: FC<CurrencyInputProps>
}

export const Web3Input: Web3Input = {
  Currency: CurrencyInput,
}
