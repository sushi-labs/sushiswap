import { ButtonProps } from '@sushiswap/ui'
import { ReactNode } from 'react'

export interface CheckerButton extends ButtonProps<'button'> {
  children: ReactNode
}
