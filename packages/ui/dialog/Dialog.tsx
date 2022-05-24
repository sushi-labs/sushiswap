import { Dialog as HeadlessDialog,Transition } from '@headlessui/react'
import React, { FC, Fragment, FunctionComponent } from 'react'

import { ExtractProps } from '../types'
import DialogActions, { DialogActionProps } from './DialogActions'
import DialogContent, { DialogContentProps } from './DialogContent'
import DialogDescription, { DialogDescriptionProps } from './DialogDescription'
import DialogHeader, { DialogHeaderProps } from './DialogHeader'

type DialogRootProps = ExtractProps<typeof HeadlessDialog> & {
  children?: React.ReactNode
}

const DialogRoot: FC<DialogRootProps> = ({ open, onClose, children, ...rest }) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <HeadlessDialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose} {...rest}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HeadlessDialog.Overlay className="fixed inset-0 transition-opacity bg-slate-700 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {children}
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}

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
