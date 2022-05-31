import { FC } from 'react'

import Typography from '../Typography'
import { Step } from './Step'

export interface StepDescription extends Step {}

const StepDescription: FC<StepDescription> = ({ children }) => {
  return (
    <Typography variant="sm" className="text-secondary">
      {children}
    </Typography>
  )
}

export default StepDescription
