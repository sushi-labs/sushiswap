import { Children, cloneElement, createContext, FC, isValidElement, useContext, useMemo } from 'react'

interface StepperContext {
  activeStep: number
  setActiveStep(x: number): void
}

const StepperContext = createContext<StepperContext>({
  activeStep: 0,
  setActiveStep(_: number) {},
})

export const useStepperContext = () => useContext(StepperContext)

const StepperRoot: FC<StepperContext> = ({ children, activeStep, setActiveStep }) => {
  const contextValue = useMemo(
    () => ({
      activeStep,
      setActiveStep,
    }),
    [activeStep, setActiveStep]
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

        return child
      })}
    </StepperContext.Provider>
  )
}

export default StepperRoot
