import React, { Children, cloneElement, FC, isValidElement } from 'react'

import { StepContentInterface } from './StepContent'
import { StepLabelInterface } from './StepLabel'
import { StepDetails } from './Stepper'

export interface StepInterface extends StepDetails {
  children: Array<React.ReactElement<StepLabelInterface | StepContentInterface>>
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
