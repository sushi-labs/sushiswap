import { CheckCircleIcon } from '@heroicons/react/solid'
import { CircleWithText } from 'app/components/Icon'
import { useStepperContext } from 'app/components/Stepper/StepperRoot'
import { FC } from 'react'

import Typography from '../Typography'
import { Step } from './Step'

interface StepLabel extends Step {}

const StepLabel: FC<StepLabel> = ({ children, _index }) => {
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
          className={activeStep < Number(_index) ? 'text-secondary' : 'text-blue'}
        />
      )}
      <Typography variant="sm" weight={700} className="text-high-emphesis">
        {children}
      </Typography>
    </div>
  )
}

export default StepLabel
