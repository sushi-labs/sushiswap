import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { FC } from 'react'

import { CircleWithText } from '../../icons'
import { Typography } from '../../typography'
import { StepDetails, useStepperContext } from './Stepper'

export interface StepLabelInterface extends StepDetails {
  children: string
}

export const StepLabel: FC<StepLabelInterface> = ({ children, _index }) => {
  const { activeStep } = useStepperContext()

  return (
    <div className="flex gap-3 items-center my-2">
      {activeStep > Number(_index) ? (
        <CheckCircleIcon width={24} height={24} className="text-blue" />
      ) : (
        <CircleWithText
          text={_index}
          width={24}
          height={24}
          className={activeStep < Number(_index) ? 'text-slate-500' : 'text-blue'}
        />
      )}
      <Typography
        variant="sm"
        weight={500}
        className={activeStep === Number(_index) ? 'text-slate-200' : 'text-slate-400'}
      >
        {children}
      </Typography>
    </div>
  )
}
