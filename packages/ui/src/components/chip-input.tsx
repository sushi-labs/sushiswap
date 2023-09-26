'use client'

import { VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import * as React from 'react'
import { FC, useEffect, useRef, useState, useTransition } from 'react'

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
    Omit<VariantProps<typeof chipVariants>, 'variant'>,
    VariantProps<typeof textFieldVariants> {
  icon?: IconComponent
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>
  onValueChange(values: string[]): void
  values: string[]
  mutateValue?(string: string): string
  delimiters?: string[]
  maxValues?: number
}

const ChipInput: FC<ChipInputProps> = ({
  className,
  icon: Icon,
  iconProps,
  size,
  values,
  variant,
  onValueChange,
  delimiters = [',', ';', ':', ' ', 'Enter', 'Tab'],
  mutateValue,
  maxValues,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null)
  const [state, setState] = useState(`${values.join(',')},`)
  const [pending, startTransition] = useTransition()
  const inputHasText = ref.current && ref.current.value !== ''

  // Empty when reset
  useEffect(() => {
    if (values.length === 0) {
      setState('')
    }
  }, [values])

  const split = (str: string) => {
    const regExp = new RegExp(`(?:${delimiters.map((el) => el).join('|')})+`)
    return str.split(regExp).filter((el) => el !== '')
  }

  const sync = (values: string[]) => startTransition(() => onValueChange(values))

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!ref.current) return

    const value = e.currentTarget.value
    if (delimiters.includes(e.key)) {
      setState((prev) => `${prev}${value}`)
      ref.current.value = ''
    }

    sync([...split(state), value])
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (e.code === 'Backspace' && value === '') {
      setState((prev) => {
        const removeLastTag = split(prev).slice(0, -1)
        sync(removeLastTag)

        return `${removeLastTag.join(' ')},`
      })
    }
  }

  const removeTag = (index: number) => {
    setState((prev) => {
      const tags = split(prev)
      const newTags = [...tags.slice(0, index), ...tags.slice(index + 1)]
      sync(newTags)

      return `${newTags.join(' ')},`
    })
  }

  const tags = split(state)

  return (
    <ChipInputRoot className={textFieldVariants({ variant, size, className: 'relative gap-2 flex-wrap !h-[unset]' })}>
      {Icon ? <Icon {...iconProps} className={buttonIconVariants()} /> : null}
      {tags.length > 0
        ? tags.map((value, i) => (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Chip onClose={() => removeTag(i)} variant="secondary">
                    {mutateValue ? mutateValue(value) : value}
                  </Chip>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{value}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        : null}
      {(maxValues ? tags.length < maxValues : true) ? (
        <input
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className={classNames(className, 'flex flex-grow bg-transparent truncate !outline-none !ring-0')}
          ref={ref}
          {...props}
        />
      ) : null}
    </ChipInputRoot>
  )
}

export { ChipInput }
