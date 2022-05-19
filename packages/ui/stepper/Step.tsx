import React, { Children, cloneElement, FC, isValidElement } from 'react'

import { StepContent } from './StepContent'
import { StepLabel } from './StepLabel'
import { StepDetails } from './Stepper'

interface StepInterface extends StepDetails {
  children: [React.ReactElement<typeof StepLabel>, React.ReactElement<typeof StepContent>]
}

export const Step: FC<StepInterface> = ({ _index, _active, _last, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              _index,
              _active,
              _last,
            })
          }
        })}
      </div>
    </div>
  )
}
