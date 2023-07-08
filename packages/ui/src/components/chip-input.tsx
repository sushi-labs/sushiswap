import { VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import * as React from 'react'
import { useCallback, useState } from 'react'

import { Chip, chipVariants } from './chip'
import { inputVariants } from './inputnew'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export type ChipInputRootProps = React.InputHTMLAttributes<HTMLDivElement>

const ChipInputRoot = React.forwardRef<HTMLDivElement, ChipInputRootProps>(({ ...props }, ref) => {
  return <div ref={ref} className="flex gap-2 items-center" {...props} />
})
ChipInputRoot.displayName = 'ChipInputRoot'

interface ChipInputProps extends React.HTMLAttributes<HTMLInputElement>, VariantProps<typeof chipVariants> {
  onValueChange(values: string[]): void
  values: string[]
  mutateValue?(string: string): string
  delimiters?: string[]
}

const ChipInput = React.forwardRef<HTMLInputElement, ChipInputProps>(
  ({ className, values, variant, onValueChange, delimiters = [',', ';', ':'], mutateValue, ...props }, ref) => {
    const [state, setState] = useState<string>('')
    const onKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (delimiters.includes(e.key) && state !== '') {
          const regExp = new RegExp(`(?:${delimiters.map((el) => el).join('|')})+`)
          onValueChange([...values, ...state.split(regExp).filter((el) => el !== '')])
          setState('')
        } else if (e.code === 'Backspace') {
          onValueChange(values.slice(0, -1))
        }
      },
      [delimiters, onValueChange, state, values]
    )

    const onChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (delimiters.includes(e.currentTarget.value)) return
        setState(e.currentTarget.value)
      },
      [delimiters]
    )

    return (
      <ChipInputRoot className={inputVariants({ size: 'default', className: 'gap-2 flex-wrap !h-[unset]' })}>
        {values.map((value, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Chip variant={variant} className="!block truncate max-w-[80px]">
                  {mutateValue ? mutateValue(value) : value}
                </Chip>
              </TooltipTrigger>
              <TooltipContent>
                <p>{value}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <input
          type={type}
          value={state}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={classNames(className, 'flex flex-grow bg-transparent')}
          ref={ref}
          {...props}
        />
      </ChipInputRoot>
    )
  }
)
ChipInput.displayName = 'ChipInput'

export { ChipInput }
