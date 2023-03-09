import { FC } from 'react'

import { Button } from '../../button'
import { StepDetails, useStepperContext } from './Stepper'

export interface StepButtonsInterface extends StepDetails {
  disabled?: boolean
}

export const StepButtons: FC<StepButtonsInterface> = ({ disabled, _index }) => {
  const { setActiveStep, steps } = useStepperContext()
  if (_index === undefined) return null

  return (
    <div className="flex gap-4">
      {_index >= 0 && _index < steps - 1 && (
        <Button size="sm" variant="filled" disabled={disabled} onClick={() => setActiveStep(_index + 1)}>
          Continue
        </Button>
      )}
      {_index > 0 && (
        <Button
          size="sm"
          color={_index === steps - 1 ? 'blue' : 'gray'}
          variant={_index === steps - 1 ? 'filled' : 'empty'}
          onClick={() => setActiveStep(_index - 1)}
        >
          Back
        </Button>
      )}
    </div>
  )
}
