'use client'

import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import * as SelectPrimitive from '@radix-ui/react-select'
import classNames from 'classnames'
import * as React from 'react'
import type { FC } from 'react'

import { textFieldVariants } from './text-field'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectIcon = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Icon>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Icon ref={ref} {...props} asChild>
    <ChevronDownIcon
      strokeWidth={2}
      width={16}
      height={16}
      className={classNames(className, 'w-4 h-4')}
    />
  </SelectPrimitive.Icon>
))
SelectIcon.displayName = SelectPrimitive.Icon.displayName

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const content = props.asChild ? (
    children
  ) : (
    <div className="flex gap-2 items-center justify-between w-full">
      {children}
      <SelectIcon />
    </div>
  )

  return (
    <>
      <SelectPrimitive.Trigger
        ref={ref}
        className={textFieldVariants({
          className: classNames(className, 'flex justify-between items-center'),
        })}
        {...props}
      >
        {content}
      </SelectPrimitive.Trigger>
    </>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
  (
    {
      className,
      children,
      collisionPadding = 8,
      sideOffset = 4,
      position = 'popper',
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset}
        className={classNames(
          'max-h-[--radix-select-content-available-height] p-0.5 relative z-50 min-w-[8rem] rounded-xl overflow-hidden bg-white/50 paper dark:bg-slate-800/50 shadow-md animate-in fade-in-80',
          position === 'popper' && 'translate-y-1 ',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton>Test</SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport
          className={classNames(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)]  min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton>
          Test
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
)
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <>
    <input
      value={props['aria-label']}
      placeholder="hidden placeholder"
      className="hidden peer"
    />
    <SelectPrimitive.Label
      ref={ref}
      className={classNames(
        'py-1.5 pl-8 pr-2 text-sm font-semibold',
        className,
      )}
      {...props}
    />
  </>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={classNames(
      'text-gray-700 dark:text-slate-300 relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none hover:bg-secondary focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon
          strokeWidth={3}
          width={16}
          height={16}
          className="text-blue"
        />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={classNames('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

const SelectCaption: FC<{ children: React.ReactNode; isError?: boolean }> = ({
  children,
  isError,
}) => {
  if (!children) return <></>

  return (
    <span
      className={classNames(
        isError ? 'text-red' : '',
        'mt-1.5 inline-block px-3 text-sm text-gray-500',
      )}
    >
      {children}
    </span>
  )
}

export {
  Select,
  SelectCaption,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectPrimitive,
}
