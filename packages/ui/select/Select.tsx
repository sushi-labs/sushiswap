import { Listbox, Menu as HeadlessMenu, Transition } from '@headlessui/react'
import SelectLabel, { SelectLabelProps } from './SelectLabel'
import SelectOptions, { SelectOptionsProps } from './SelectOptions'
import SelectOption, { SelectOptionProps } from './SelectOption'
import SelectButton, { SelectButtonProps } from './SelectButton'
import { FC, Fragment, FunctionComponent, ReactElement } from 'react'
import { ExtractProps } from '../types'

type SelectProps = ExtractProps<typeof HeadlessMenu.Button> & {
  button: ReactElement<ExtractProps<typeof Listbox.Button>>
  label: ReactElement<ExtractProps<typeof Listbox.Label>>
  children: ReactElement<ExtractProps<typeof Listbox.Options>>
}

const SelectRoot: FC<SelectProps> = ({ value, onChange, disabled, horizontal, button, children, label }) => {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled} horizontal={horizontal}>
      {({ open }) => (
        <>
          {label}
          <div className="mt-1 relative">
            {button}
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
        </>
      )}
    </Listbox>
  )
}

export const Select: FunctionComponent<SelectProps> & {
  Label: FC<SelectLabelProps>
  Options: FC<SelectOptionsProps>
  Option: FC<SelectOptionProps>
  Button: FC<SelectButtonProps>
} = Object.assign(SelectRoot, {
  Label: SelectLabel,
  Options: SelectOptions,
  Option: SelectOption,
  Button: SelectButton,
})
