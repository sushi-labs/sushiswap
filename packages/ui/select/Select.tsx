import { Listbox, Menu as HeadlessMenu, Transition } from '@headlessui/react'
import SelectLabel, { SelectLabelProps } from './SelectLabel'
import SelectOption, { SelectOptionProps } from './SelectOption'
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
          <div className="relative mt-1">
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
  Option: FC<SelectOptionProps>
} = Object.assign(SelectRoot, {
  Label: SelectLabel,
  Option: SelectOption,
})
