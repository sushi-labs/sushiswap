import React, { Children, cloneElement, createContext, FC, isValidElement, useContext, useMemo } from 'react'

import { Step, StepInterface } from './Step'
import { StepButtons } from './StepButtons'
import { StepContent } from './StepContent'
import { StepDescription } from './StepDescription'
import { StepLabel } from './StepLabel'

export interface StepDetails {
  _index?: number
  _active?: boolean
  _last?: boolean
}

export interface VerticalStepperInterface {
  children: React.ReactElement<StepInterface> | Array<React.ReactElement<StepInterface>>
  activeStep: number
  setActiveStep(x: number): void
}

const StepperContext = createContext<Omit<VerticalStepperInterface, 'children'> & { steps: number }>({
  steps: 0,
  activeStep: 0,
  setActiveStep(_: number) {
    //
  },
})

export const useStepperContext = () => useContext(StepperContext)

const StepperRoot: FC<VerticalStepperInterface> = ({ children, activeStep, setActiveStep }) => {
  const contextValue = useMemo(
    () => ({
      steps: Children.count(children),
      activeStep,
      setActiveStep,
    }),
    [activeStep, children, setActiveStep]
  )

  return (
    <StepperContext.Provider value={contextValue}>
      {Children.map(children, (child, _index) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            _index,
            _active: _index === activeStep,
            _last: _index === Children.count(children) - 1,
          })
        }
      })}
    </StepperContext.Provider>
  )
}

export const VerticalStepper: typeof StepperRoot & {
  Step: typeof Step
  Content: typeof StepContent
  Description: typeof StepDescription
  Label: typeof StepLabel
  Buttons: typeof StepButtons
} = Object.assign(StepperRoot, {
  Step: Step,
  Content: StepContent,
  Description: StepDescription,
  Label: StepLabel,
  Buttons: StepButtons,
})
