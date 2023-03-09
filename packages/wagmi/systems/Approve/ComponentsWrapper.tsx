import { Transition } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import React, { FC, ReactElement } from 'react'

import { DefaultButtonInterface } from './DefaultButton'

type ComponentsWrapper = {
  className?: string
  children:
    | ReactElement<DefaultButtonInterface>
    | Array<ReactElement<DefaultButtonInterface> | undefined>
    | Array<Array<ReactElement<DefaultButtonInterface>> | ReactElement<DefaultButtonInterface> | undefined>
}

export const ComponentsWrapper: FC<ComponentsWrapper> = ({ className, children }) => {
  return (
    <Transition
      appear
      show={true}
      className="transition-[max-height] overflow-hidden"
      enter="duration-[400ms] ease-in-out delay-300"
      enterFrom="transform max-h-0"
      enterTo="transform max-h-[80px]"
      leave="transition-[max-height] duration-250 ease-in-out"
      leaveFrom="transform max-h-[80px]"
      leaveTo="transform max-h-0"
    >
      <div className={classNames(className, 'relative flex gap-6')}>
        <div className="flex gap-6 z-10">{children}</div>
        <div className="absolute pointer-events-none top-0 bottom-3 flex items-center left-4 right-4">
          <div className="border border-dashed border-white border-opacity-[0.12] h-px w-full z-0" />
        </div>
      </div>
    </Transition>
  )
}
