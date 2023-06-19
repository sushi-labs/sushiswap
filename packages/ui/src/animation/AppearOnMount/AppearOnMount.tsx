import { Transition } from '@headlessui/react'
import { useIsMounted } from '@sushiswap/hooks'
import { ElementType, FC, Fragment, ReactNode } from 'react'

interface AppearOnMount {
  as?: ElementType<any>
  show?: boolean
  children: ((mounted: boolean) => ReactNode) | ReactNode
  enabled?: boolean
  className?: string
}

/**
 * @deprecated
 */
export const AppearOnMount: FC<AppearOnMount> = ({ as = 'div', show, children, enabled = true, className }) => {
  const isMounted = useIsMounted()

  if (!enabled) {
    return <>{typeof children === 'function' ? children(isMounted) : children}</>
  }

  if (isMounted)
    return (
      <Transition
        as={as}
        appear
        className={className}
        show={show !== undefined ? show : true}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform scale-90 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        {typeof children === 'function' ? children(isMounted) : children}
      </Transition>
    )

  return <></>
}
