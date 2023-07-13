import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { classNames } from '../index'
import { IconComponent } from '../types'
import { buttonIconVariants } from './button'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

const numericInputProps: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {
  placeholder: '0.0',
}

const percentInputProps: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {
  placeholder: '0',
  pattern: '^[0-9]*$',
  inputMode: 'decimal',
  maxLength: 3,
}

const textFieldVariants = cva(
  'truncate border-0 appearance-none dark:text-slate-50 focus:outline-none focus:ring-0 text-gray-900 w-full',
  {
    variants: {
      variant: {
        default:
          'flex items-center min-h-[40px] h-[40px] py-2 px-3 rounded-lg font-medium block bg-secondary group-hover:bg-muted group-focus:bg-accent',
        naked: 'bg-transparent',
      },
      hasIcon: {
        yes: 'pl-[40px]',
        no: '',
      },
      hasUnit: {
        yes: 'rounded-r-none',
        no: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      hasIcon: 'no',
      hasUnit: 'no',
    },
  }
)

type InputType = 'text' | 'number' | 'percent'

interface TextFieldBaseProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof textFieldVariants> {
  id?: string
  icon?: IconComponent
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>
  unit?: string
}

interface TextFieldDynamicProps<T extends InputType> {
  type: T
  maxDecimals?: T extends 'number' ? number : never
  onValueChange?(val: string): void
}

export type TextFieldProps<T extends InputType> = TextFieldBaseProps & TextFieldDynamicProps<T>

const isTypeText = (type: InputType): type is 'text' => type === 'text'
const isTypeNumber = (type: InputType): type is 'number' => type === 'number'
const isTypePercent = (type: InputType): type is 'percent' => type === 'percent'

const Component = <T extends InputType>(
  { icon: Icon, iconProps, unit, variant, className, type, onChange, onValueChange, ...props }: TextFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const _onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = (e) => {
    const nextUserInput = e.target.value
    if (typeof nextUserInput === 'undefined') {
      return
    }

    if (isTypeNumber(type)) {
      console.log(nextUserInput)
      const val = `${nextUserInput}`.replace(/,/g, '.')
      if (onValueChange && val === '') onValueChange('')

      if (inputRegex.test(escapeRegExp(val))) {
        if (props.maxDecimals && val?.includes('.')) {
          const [, decimals] = val.split('.')
          if (onValueChange && decimals.length <= props.maxDecimals) {
            onValueChange(val)
          }
        } else {
          if (onValueChange) onValueChange(val)
        }
      }
    } else if (isTypeText(type) && onValueChange) {
      onValueChange(nextUserInput)
    } else if (isTypePercent(type)) {
      const _nextUserInput = nextUserInput.replace(/,/g, '.').replace(/%/g, '')
      if (_nextUserInput === '' || inputRegex.test(escapeRegExp(_nextUserInput))) {
        if (onValueChange) onValueChange(_nextUserInput)
      }
    }

    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className="group relative flex items-center justify-between w-full">
      {Icon ? (
        <Icon {...iconProps} className={buttonIconVariants({ className: 'text-muted-foreground absolute left-3' })} />
      ) : null}
      <input
        onChange={_onChange}
        className={textFieldVariants({
          variant,
          hasIcon: Icon ? 'yes' : 'no',
          hasUnit: unit ? 'yes' : 'no',
          className: classNames(className, 'flex-grow flex-1'),
        })}
        ref={ref}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        autoComplete="off"
        {...(isTypeNumber(type) && numericInputProps)}
        {...(isTypePercent(type) && percentInputProps)}
        {...props}
      />
      {unit ? (
        <div className={textFieldVariants({ className: 'text-muted-foreground rounded-l-none !w-[unset]' })}>
          {unit}
        </div>
      ) : null}
    </div>
  )
}

const TextField = React.forwardRef(Component)
TextField.displayName = 'TextField'

export { TextField, textFieldVariants }
