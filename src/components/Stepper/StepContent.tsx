import { Transition } from '@headlessui/react'
import { classNames } from 'app/functions'
import { FC, Fragment, ReactNode } from 'react'

import { Step } from './Step'

interface StepContent extends Step {
  description: ReactNode
}

const StepContent: FC<StepContent> = ({ children, description, _index, _active, _last }) => {
  return (
    <div className="flex gap-3">
      <div className={classNames(_last ? '' : 'bg-dark-700', 'flex flex-grow-col min-h-[16px] mx-3 w-px')} />
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
          {children}
          <div />
        </div>
      </Transition>
    </div>
  )
}

export default StepContent
