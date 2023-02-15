import { ReactNode } from 'react'
import { ButtonProps } from '@sushiswap/ui/future/components/button'

export interface CheckerButton extends ButtonProps<'button'> {
  children: ReactNode
}
