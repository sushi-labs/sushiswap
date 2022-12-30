import { Typography } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'

interface HelperTextPanel {
  text: ReactNode
  isError: boolean
}

export const HelperTextPanel: FC<HelperTextPanel> = ({ text, isError }) => {
  return (
    <Typography variant="xs" className={isError ? 'text-red' : 'text-slate-500'}>
      {text}
    </Typography>
  )
}
