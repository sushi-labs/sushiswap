'use client'

import { RadioGroup } from '@headlessui/react'
import { classNames, toggleVariants } from '@sushiswap/ui'
import { Fragment, type ReactElement } from 'react'

interface SegmentedControlOption<Value extends string> {
  value: Value
  label: string
  disabled?: boolean
  descriptionId?: string
  variant?: 'default' | 'primary' | 'outline'
}

interface SegmentedControlProps<Value extends string> {
  label: string
  value: Value | null
  onValueChange(value: Value): void
  options: readonly SegmentedControlOption<Value>[]
  className?: string
  variant?: 'default' | 'primary' | 'outline'
}

export function SegmentedControl<Value extends string>({
  label,
  value,
  onValueChange,
  options,
  className,
  variant = 'default',
}: SegmentedControlProps<Value>): ReactElement {
  return (
    <RadioGroup
      value={value}
      onChange={onValueChange}
      aria-label={label}
      className={classNames(
        'inline-flex w-fit items-center rounded-lg border border-accent bg-background p-1 text-muted-foreground',
        className,
      )}
    >
      {options.map((option) => (
        <RadioGroup.Option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          as={Fragment}
        >
          <button
            type="button"
            disabled={option.disabled}
            aria-describedby={option.descriptionId}
            data-state={value === option.value ? 'on' : 'off'}
            className={toggleVariants({
              size: 'sm',
              variant,
              className: '!h-8 !rounded-md !px-3',
            })}
            // Keep explicit re-selection available to each control's handler.
            onClick={() => {
              if (value === option.value) onValueChange(option.value)
            }}
            onKeyDown={(event) => {
              if (event.key === ' ' && value === option.value)
                onValueChange(option.value)
            }}
          >
            {option.label}
          </button>
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  )
}
