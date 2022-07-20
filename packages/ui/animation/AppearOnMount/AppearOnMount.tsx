import { Transition } from '@headlessui/react'
import { useIsMounted } from '@sushiswap/hooks'
import { FC, ReactNode } from 'react'

interface AppearOnMount {
  children(mounted: boolean): ReactNode
}

export const AppearOnMount: FC<AppearOnMount> = ({ children }) => {
  const isMounted = useIsMounted()

  return (
    <Transition
      appear
      show={isMounted}
      enter="transition duration-300 origin-center ease-out"
      enterFrom="transform scale-90 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0"
    >
      {children(isMounted)}
    </Transition>
  )
}
