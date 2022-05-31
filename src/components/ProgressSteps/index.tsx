import { classNames } from 'app/functions'
import React from 'react'

interface ProgressCirclesProps {
  steps: boolean[]
  disabled?: boolean
}

/**
 * Based on array of steps, create a step counter of circles.
 * A circle can be enabled, disabled, or confirmed. States are derived
 * from previous step.
 *
 * An extra circle is added to represent the ability to swap, add, or remove.
 * This step will never be marked as complete (because no 'txn done' state in body ui).
 *
 * @param steps  array of booleans where true means step is complete
 */
export default function ProgressCircles({ steps, disabled = false, ...rest }: ProgressCirclesProps) {
  return (
    <div className="flex justify-center" {...rest}>
      <div className="flex justify-between w-1/2">
        {steps.map((step, i) => {
          return (
            <div className="flex items-center w-full" key={i}>
              <div
                className={classNames(
                  step ? 'bg-green' : 'bg-pink',
                  (disabled || (!steps[i - 1] && i !== 0)) && 'bg-dark-800',
                  'min-w-5 min-h-5 rounded-full flex justify-center items-center text-xs'
                )}
              >
                {step ? '✓' : i + 1}
              </div>
              <div
                className={classNames(
                  disabled && 'bg-dark-1000',
                  step && 'bg-gradient-to-r from-green to-pink',
                  steps[i - 1] ? 'bg-gradient-to-r from-pink to-dark-1000' : 'bg-dark-900',
                  'w-full h-0.5 opacity-60'
                )}
              />
              {/* <Connector prevConfirmed={step} disabled={disabled} /> */}
            </div>
          )
        })}
        <div
          className={classNames(
            (disabled || !steps[steps.length - 1]) && 'bg-dark-800',
            'min-w-5 min-h-5 rounded-full flex justify-center items-center text-xs'
          )}
        >
          {steps.length + 1}
        </div>
      </div>
    </div>
  )
}
