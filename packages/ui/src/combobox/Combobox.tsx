import { Combobox as HeadlessCombobox, Menu as HeadlessMenu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { FC, Fragment, FunctionComponent, ReactElement } from 'react'

import { ExtractProps } from '../types'
import ComboboxInput, { ComboboxInputProps } from './ComboboxInput'
import ComboboxLabel, { ComboboxLabelProps } from './ComboboxLabel'
import ComboboxOption, { ComboboxOptionProps } from './ComboboxOption'
import ComboboxOptions, { ComboboxOptionsProps } from './ComboboxOptions'

type ComboboxProps = ExtractProps<typeof HeadlessMenu.Button> & {
  input: ReactElement<ExtractProps<typeof HeadlessCombobox.Input>>
  label: ReactElement<ExtractProps<typeof HeadlessCombobox.Label>>
  children: ReactElement<ExtractProps<typeof HeadlessCombobox.Options>>
}

const ComboboxRoot: FC<ComboboxProps> = ({ className, value, onChange, disabled, input, children, label }) => {
  return (
    <HeadlessCombobox value={value} onChange={onChange} disabled={disabled}>
      {({ open }) => (
        <div className={classNames('space-y-2', className)}>
          {label}
          <div className="relative mt-2">
            {input}
            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
            >
              {children}
            </Transition>
          </div>
        </div>
      )}
    </HeadlessCombobox>
  )
}

/**
 * @deprecated
 */
export const Combobox: FunctionComponent<ComboboxProps> & {
  Input: FC<ComboboxInputProps>
  Label: FC<ComboboxLabelProps>
  Option: FC<ComboboxOptionProps>
  Options: FC<ComboboxOptionsProps>
} = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Label: ComboboxLabel,
  Option: ComboboxOption,
  Options: ComboboxOptions,
})
