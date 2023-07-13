import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

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
          'flex items-center min-h-[40px] h-[40px] py-2 px-3 rounded-lg font-medium block bg-secondary hover:bg-muted focus:bg-accent',
        naked: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type InputType = 'text' | 'number' | 'percent'

interface TextFieldBaseProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof textFieldVariants> {
  id?: string
  label?: string
}

interface TextFieldDynamicProps<T extends InputType> {
  type: T
  maxDecimals?: T extends 'number' ? number : never
  onValueChange: <T>(val: T extends 'date' ? Date | null : string) => void
}

type TextFieldProps<T extends InputType> = TextFieldBaseProps & TextFieldDynamicProps<T>

const isTypeText = (type: InputType): type is 'text' => type === 'text'
const isTypeNumber = (type: InputType): type is 'number' => type === 'number'
const isTypePercent = (type: InputType): type is 'percent' => type === 'percent'

const Component = <T extends InputType>(
  { variant, className, type, onChange, onValueChange, ...props }: TextFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const _onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = (e) => {
    const nextUserInput = e.target.value
    if (typeof nextUserInput === 'undefined') {
      return
    }

    if (isTypeNumber(type)) {
      const val = `${nextUserInput}`.replace(/,/g, '.')
      if (val === '') onValueChange('')

      if (inputRegex.test(escapeRegExp(val))) {
        if (props.maxDecimals && val?.includes('.')) {
          const [, decimals] = val.split('.')
          if (decimals.length <= props.maxDecimals) {
            onValueChange(val)
          }
        } else {
          onValueChange(val)
        }
      }
    } else if (isTypeText(type)) {
      onValueChange(nextUserInput)
    } else if (isTypePercent(type)) {
      const _nextUserInput = nextUserInput.replace(/,/g, '.').replace(/%/g, '')
      if (_nextUserInput === '' || inputRegex.test(escapeRegExp(_nextUserInput))) {
        onValueChange(_nextUserInput)
      }
    }

    if (onChange) {
      onChange(e)
    }
  }

  return (
    <input
      onChange={_onChange}
      type={type}
      className={textFieldVariants({ variant, className })}
      ref={ref}
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      autoComplete="off"
      {...(isTypeNumber(type) && numericInputProps)}
      {...(isTypePercent(type) && percentInputProps)}
      {...props}
    />
  )
}

const TextField = React.forwardRef(Component)
TextField.displayName = 'TextField'

export { TextField, textFieldVariants }
