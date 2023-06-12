import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { useBreakpoint } from '@sushiswap/hooks'
import React, { FC, Fragment, FunctionComponent, useEffect } from 'react'

import DialogActions, { DialogActionProps } from './DialogActions'
import DialogContent, { DialogContentProps } from './DialogContent'
import DialogDescription, { DialogDescriptionProps } from './DialogDescription'
import DialogHeader, { DialogHeaderProps } from './DialogHeader'
import { syncScrollLockSafeArea } from '../../lib'
import { ExtractProps } from '../../../types'
import { MaxWidth, MaxWidthMapper } from '../Container'
import classNames from 'classnames'

export type DialogRootProps = ExtractProps<typeof HeadlessDialog> & {
  afterLeave?(): void
  children?: React.ReactNode
  variant?: 'transparent' | 'opaque'
  maxWidth?: MaxWidth
}

const DialogRoot: FC<DialogRootProps> = ({
  open,
  onClose,
  children,
  afterLeave,
  maxWidth = 'md',
  variant = 'transparent',
  ...rest
}) => {
  const { unmount } = rest
  const { isMd } = useBreakpoint('md')

  // iOS body lock fix
  // This gets the current scroll position and sets it as negative top margin before setting position fixed on body
  // This is necessary because adding position fixed to body scrolls the page to the top
  useEffect(() => {
    if (!isMd) {
      if (open) {
        document.body.style.top = `-${window.scrollY}px`
        document.body.style.position = 'fixed'
        document.body.style.left = '0'
        document.body.style.right = '0'
      } else {
        const scrollY = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isMd, open])

  useEffect(syncScrollLockSafeArea, [open])

  return (
    <Transition show={open} as={Fragment} afterLeave={afterLeave} unmount={unmount}>
      <HeadlessDialog className="relative z-[1080]" onClose={onClose} {...rest}>
        {variant === 'transparent' && (
          <>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              unmount={unmount}
            >
              <div className="fixed inset-0 bg-black/10 paper dark:bg-black/40 transform-gpu" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-full text-center sm:items-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  unmount={unmount}
                >
                  <HeadlessDialog.Panel className={classNames(MaxWidthMapper[maxWidth], 'w-full h-full px-1')}>
                    {children}
                  </HeadlessDialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </>
        )}
        {variant === 'opaque' && (
          <>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              unmount={unmount}
            >
              <div className="fixed inset-0 dark:bg-slate-900 bg-gray-100" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto flex justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                unmount={unmount}
              >
                <HeadlessDialog.Panel className="w-full h-full max-w-xl px-1">{children}</HeadlessDialog.Panel>
              </Transition.Child>
            </div>
          </>
        )}
      </HeadlessDialog>
    </Transition>
  )
}

/**
 * @deprecated use @sushiswap/ui/future/components/modal/Modal
 */
export const Dialog: FunctionComponent<DialogRootProps> & {
  Description: FunctionComponent<DialogDescriptionProps>
  Header: FunctionComponent<DialogHeaderProps>
  Actions: FunctionComponent<DialogActionProps>
  Content: FunctionComponent<DialogContentProps>
} = Object.assign(DialogRoot, {
  Content: DialogContent,
  Header: DialogHeader,
  Description: DialogDescription,
  Actions: DialogActions,
})
