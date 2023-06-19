import { Listbox, Menu as HeadlessMenu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { cloneElement, FC, Fragment, ReactElement } from 'react'

import { ExtractProps } from '../types'
import SelectButton, { SelectButtonProps } from './SelectButton'
import SelectLabel, { SelectLabelProps } from './SelectLabel'
import SelectOption, { SelectOptionProps } from './SelectOption'
import SelectOptions, { SelectOptionsProps } from './SelectOptions'

type SelectProps = ExtractProps<typeof HeadlessMenu.Button> & {
  button: ReactElement<ExtractProps<typeof Listbox.Button>>
  label?: ReactElement<ExtractProps<typeof Listbox.Label>>
  children: ReactElement<ExtractProps<typeof Listbox.Options>>
}

const SelectRoot: FC<SelectProps> = ({
  className,
  value,
  onChange,
  disabled,
  horizontal,
  button,
  multiple,
  children,
  label,
}) => {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled} horizontal={horizontal} multiple={multiple}>
      {({ open }: { open: boolean }) => (
        <div className={classNames('space-y-2 flex flex-col gap-2', className)}>
          {label && label}
          <div className="relative">
            {cloneElement(button, { open })}
            <Transition
              as={Fragment}
              show={open}
              enter="transition duration-300 ease-out"
              enterFrom="transform translate-y-[-16px] opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition duration-300 ease-out"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform translate-y-[-16px] opacity-0"
            >
              {children}
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  )
}

/**
 * @deprecated
 */
export const Select: FC<SelectProps> & {
  Button: FC<SelectButtonProps>
  Label: FC<SelectLabelProps>
  Option: FC<SelectOptionProps>
  Options: FC<SelectOptionsProps>
} = Object.assign(SelectRoot, {
  Button: SelectButton,
  Label: SelectLabel,
  Option: SelectOption,
  Options: SelectOptions,
})
