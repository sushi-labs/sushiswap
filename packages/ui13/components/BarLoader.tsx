import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { FC } from 'react'

interface BarLoader {
  onComplete?(): void
  transitionDuration: number
  className?: string
}

export const BarLoader: FC<BarLoader> = ({ transitionDuration, className, onComplete }) => {
  return (
    <div className={classNames(className, 'relative rounded-full h-1 bg-gray-300 w-full overflow-hidden w-10')}>
      <Transition
        appear
        enter="transition ease-linear"
        enterFrom="transform translate-x-[-100%]"
        enterTo="transform translate-x-0"
        leave="transition duration-300 ease-linear"
        leaveFrom="transform translate-x-0"
        leaveTo="transform translate-x-[-100%]"
        style={{ transitionDuration: `${transitionDuration}ms` }}
        afterEnter={onComplete}
      >
        <div className="rounded-full inset-0 h-1 bg-gray-400 w-full" />
      </Transition>
    </div>
  )
}
