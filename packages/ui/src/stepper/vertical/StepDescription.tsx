import { FC } from 'react'

import { Typography } from '../../typography'
import { StepDetails } from './Stepper'

export interface StepDescriptionInterface extends StepDetails {
  children: string
}

export const StepDescription: FC<StepDescriptionInterface> = ({ children }) => {
  return (
    <Typography variant="sm" className="text-slate-500">
      {children}
    </Typography>
  )
}
