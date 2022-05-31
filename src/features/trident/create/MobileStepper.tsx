import { CheckIcon } from '@heroicons/react/outline'
import { selectTridentCreate, setCreateCurrentStep } from 'app/features/trident/create/createSlice'
import { classNames } from 'app/functions'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

import { activeStepColor, StepProps, stepTitleText } from './StepConstants'

const Step: FC<StepProps> = ({ stepNum, title, currentStep, stepSetter, isLastStep }) => {
  const isActive = stepNum === currentStep
  const isCompleted = currentStep > stepNum

  return (
    <div
      onClick={() => isCompleted && stepSetter(stepNum)}
      className={classNames(
        'text-center relative',
        isActive ? 'text-high-emphesis' : 'text-secondary',
        isCompleted ? 'hover:cursor-pointer' : 'select-none'
      )}
    >
      <div className="p-5 flex justify-center gap-4 items-center">
        {isCompleted ? (
          <div className="h-7 w-7 p-1 rounded-full bg-gradient-to-r from-blue to-pink flex-shrink-0">
            <CheckIcon color="white" />
          </div>
        ) : (
          <div
            className={classNames(
              'h-7 w-7 rounded-full border flex items-center justify-center flex-shrink-0',
              isActive ? 'border-blue text-blue' : 'border-gray-500'
            )}
          >
            {stepNum}
          </div>
        )}

        <div className="truncate font-bold">{title.toUpperCase()}</div>
      </div>
      <div className={classNames('h-1.5 w-full absolute bottom-0', isActive && activeStepColor)} />
      {!isLastStep && (
        <div className="h-[63px] absolute flex items-center text-dark-700 bottom-[-2px] top-0 right-[-7px]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 7 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="-ml-0"
          >
            <path d="M1 0V19.6585L6 26L1 32.3415V52" stroke="currentColor" />
          </svg>
        </div>
      )}
    </div>
  )
}

const FullWidthBorder: FC<{ location: 'top' | 'bottom' }> = ({ location }) => {
  return <div className={`absolute ${location}-0 h-[1px] bg-dark-700 w-screen -ml-12`} />
}

export const MobileStepper: FC = () => {
  const dispatch = useAppDispatch()
  const { currentStep } = useAppSelector(selectTridentCreate)

  return (
    <div className="lg:hidden grid grid-cols-2 mt-8 -mb-10 relative">
      <FullWidthBorder location="top" />
      <Step
        stepNum={1}
        title={stepTitleText[1]}
        currentStep={currentStep}
        stepSetter={(step) => dispatch(setCreateCurrentStep(step))}
      />
      <Step
        stepNum={2}
        title={stepTitleText[2]}
        currentStep={currentStep}
        stepSetter={(step) => dispatch(setCreateCurrentStep(step))}
        isLastStep
      />
      <FullWidthBorder location="bottom" />
    </div>
  )
}
