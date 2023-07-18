'use client'

import { VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import * as React from 'react'
import { useCallback, useState } from 'react'

import { IconComponent } from '../types'
import { buttonIconVariants } from './button'
import { Chip, chipVariants } from './chip'
import { textFieldVariants } from './text-field'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export type ChipInputRootProps = React.InputHTMLAttributes<HTMLDivElement>

const ChipInputRoot = React.forwardRef<HTMLDivElement, ChipInputRootProps>(({ ...props }, ref) => {
  return <div ref={ref} className="flex gap-2 items-center" {...props} />
})
ChipInputRoot.displayName = 'ChipInputRoot'

interface ChipInputProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof chipVariants>,
    Omit<VariantProps<typeof textFieldVariants>, 'variant'> {
  icon?: IconComponent
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>
  onValueChange(values: string[]): void
  values: string[]
  mutateValue?(string: string): string
  delimiters?: string[]
}

const ChipInput = React.forwardRef<HTMLInputElement, ChipInputProps>(
  (
    {
      className,
      icon: Icon,
      iconProps,
      size,
      values,
      variant,
      onValueChange,
      delimiters = [',', ';', ':'],
      mutateValue,
      ...props
    },
    ref
  ) => {
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
      <ChipInputRoot className={textFieldVariants({ size, className: 'gap-2 flex-wrap' })}>
        {Icon ? <Icon {...iconProps} className={buttonIconVariants()} /> : null}
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
