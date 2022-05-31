import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { FC, Fragment, ReactNode } from 'react'

import Typography from '../Typography'

interface BottomSlideInProps {
  title?: string
  open: boolean
  onClose: () => void
  closeTrigger?: ReactNode
}

const BottomSlideIn: FC<BottomSlideInProps> = ({ title, open, onClose, children, closeTrigger }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" static className="fixed inset-0 overflow-hidden z-20" open={open} onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="max-h-[fit-content] absolute bottom-0 fixed right-0 left-0 w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-200 sm:duration-700"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-200 sm:duration-700"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <div className="w-full rounded-t overflow-hidden">
                {title ? (
                  <div className="flex flex-col shadow-xl overflow-y-auto h-full bg-gradient-to-r from-blue to-pink">
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <Typography variant="lg" weight={700} className="text-high-emphesis">
                          {title}
                        </Typography>
                        {closeTrigger ? (
                          closeTrigger
                        ) : (
                          <button onClick={onClose}>
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6 text-high-emphesis" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                    {children}
                  </div>
                ) : (
                  children
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default BottomSlideIn
