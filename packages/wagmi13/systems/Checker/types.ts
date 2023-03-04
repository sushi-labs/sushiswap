import { ReactNode } from 'react'
import { ButtonProps } from '@sushiswap/ui13/components/button'

export interface CheckerButton extends ButtonProps<'button'> {
  children: ReactNode
}
