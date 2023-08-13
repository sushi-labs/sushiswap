'use client'

import { VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import * as React from 'react'
import { useCallback, useImperativeHandle, useRef, useState } from 'react'

import { IconComponent } from '../types'
import { Button, buttonIconVariants } from './button'
import { Chip, chipVariants } from './chip'
import { textFieldVariants } from './text-field'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export type ChipInputRootProps = React.InputHTMLAttributes<HTMLDivElement>

const ChipInputRoot = React.forwardRef<HTMLDivElement, ChipInputRootProps>(({ ...props }, ref) => {
  return <div ref={ref} className="flex gap-2 items-center" {...props} />
})
ChipInputRoot.displayName = 'ChipInputRoot'

interface ChipInputProps extends React.HTMLAttributes<HTMLInputElement>, VariantProps<typeof chipVariants> {
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
      values,
      variant,
      onValueChange,
      delimiters = [',', ';', ':', ' ', 'Enter', 'Tab'],
      mutateValue,
      ...props
    },
    ref
  ) => {
    const fallbackRef = useRef<HTMLInputElement>(null)
    const [state, setState] = useState<string>('')

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => fallbackRef.current)

    const split = useCallback(() => {
      const regExp = new RegExp(`(?:${delimiters.map((el) => el).join('|')})+`)
      onValueChange([...values, ...state.split(regExp).filter((el) => el !== '')])
      setState('')
    }, [delimiters, onValueChange, state, values])

    const onKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        console.log(delimiters, e.key, delimiters.includes(e.key))
        if (delimiters.includes(e.key)) {
          split()
        } else if (e.code === 'Backspace') {
          onValueChange(values.slice(0, -1))
        }
      },
      [delimiters, onValueChange, split, values]
    )

    const onChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (delimiters.includes(e.currentTarget.value)) return
        setState(e.currentTarget.value)
      },
      [delimiters]
    )

    return (
      <ChipInputRoot className={textFieldVariants({ className: 'relative gap-2 flex-wrap !h-[unset]' })}>
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
          className={classNames(
            className,
            state.length > 0 ? 'pr-[60px]' : '',
            'flex flex-grow bg-transparent truncate'
          )}
          ref={fallbackRef}
          {...props}
        />
        {state.length > 0 ? (
          <Button onClick={split} size="xs" variant="secondary" className="absolute right-2">
            Search
          </Button>
        ) : null}
      </ChipInputRoot>
    )
  }
)
ChipInput.displayName = 'ChipInput'

export { ChipInput }
