import { Transition } from '@headlessui/react'
import { Loader } from '@sushiswap/ui'
import { FC } from 'react'

import { Pair } from '../../.graphclient'

export interface AddSectionProps {
  pair: Pair
}

export const AddSection: FC<AddSectionProps> = ({ pair, ...rest }) => {
  if (!pair)
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader width="24px" />
      </div>
    )

  return (
    <Transition
      appear
      show={true}
      enter="transition duration-300 origin-center ease-out"
      enterFrom="transform scale-90 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0"
    ></Transition>
  )
}
