import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import React, { Children, cloneElement, FC, Fragment, isValidElement, ReactElement } from 'react'

import { StepDescriptionInterface } from './StepDescription'
import { StepDetails } from './Stepper'

export interface StepContentInterface extends StepDetails {
  description: React.ReactElement<StepDescriptionInterface>
  children: ReactElement | ReactElement[]
}

export const StepContent: FC<StepContentInterface> = ({ children, description, _index, _active, _last }) => {
  return (
    <div className="flex gap-3">
      <div className={classNames(_last ? '' : 'bg-slate-700', 'flex flex-grow-col min-h-[16px] mx-3 w-px')} />
      <Transition
        as={Fragment}
        show={_active}
        enter="transition-all ease-in-out duration-300 overflow-hidden"
        enterFrom="max-h-0 opacity-0"
        enterTo="max-h-[1000px] opacity-100"
        leave="transition-all ease-in-out duration-300 overflow-hidden"
        leaveFrom="max-h-[1000px] opacity-100"
        leaveTo="max-h-0 opacity-0"
        unmount={false}
      >
        {/*Empty divs act a trick to make the transition smooth with margins*/}
        <div className="space-y-8 w-full">
          {description}
          <div />
          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child as any, {
                _index,
                _active,
                _last,
              })
            }
          })}
          <div />
        </div>
      </Transition>
    </div>
  )
}
