import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import Button, { ButtonProps } from 'app/components/Button'
import { Children, cloneElement, ComponentProps, FC, Fragment, isValidElement } from 'react'

import { classNames } from '../../functions'

const FILLED = {
  group: 'border border-dark-800 rounded p-0.5 bg-dark-900',
  option: {
    // @ts-ignore TYPE NEEDS FIXING
    checked: (checked) => (checked ? 'border-transparent border-gradient-r-blue-pink-dark-900' : 'border-transparent'),
    default: 'py-1 rounded-lg border',
  },
}

const OUTLINED = {
  group: 'gap-2',
  option: {
    // @ts-ignore TYPE NEEDS FIXING
    checked: (checked) => (checked ? 'border-dark-700 bg-gradient-to-r from-blue to-pink' : 'border-dark-700'),
    default: 'py-3 rounded border',
  },
}

const VARIANTS = {
  filled: FILLED,
  outlined: OUTLINED,
}

type Props = ComponentProps<typeof HeadlessRadioGroup> & Omit<ButtonProps, 'onChange'>
type ToggleButtonGroup<P> = FC<P> & {
  Button: FC<ComponentProps<typeof HeadlessRadioGroup.Option>>
}

const ToggleButtonGroup: ToggleButtonGroup<Props> = ({
  children,
  size,
  className = '',
  variant = 'filled',
  ...props
}) => {
  return (
    <HeadlessRadioGroup
      {...props}
      // @ts-ignore TYPE NEEDS FIXING
      className={classNames(className, `flex bg-dark-1000/40 rounded-full`, VARIANTS[variant].group)}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            variant,
            size,
            style: { width: `calc(100% / ${Children.toArray(children).length})` },
          })
        }

        return child
      })}
    </HeadlessRadioGroup>
  )
}

type ToggleButtonProps = ComponentProps<typeof HeadlessRadioGroup.Option>
ToggleButtonGroup.Button = ({ value, children, size, style, className }: ToggleButtonProps) => {
  return (
    <HeadlessRadioGroup.Option value={value} as={Fragment}>
      {({ checked }) => (
        <Button
          style={style}
          size={size}
          id={`radio-option-${value}`}
          variant={checked ? 'filled' : 'empty'}
          color={checked ? 'blue' : 'gray'}
          className={className}
          type="button"
        >
          {children}
        </Button>
      )}
    </HeadlessRadioGroup.Option>
  )
}

export default ToggleButtonGroup
