'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
export * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { FC } from 'react'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => {
  return (
    <div className="pb-2 pt-[22px] font-medium">
      <SelectPrimitive.Value ref={ref} className={classNames(className)} {...props}></SelectPrimitive.Value>
    </div>
  )
})
SelectValue.displayName = SelectPrimitive.Value.displayName

const SelectIcon = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Icon>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Icon ref={ref} {...props} asChild>
    <ChevronDownIcon strokeWidth={2} width={16} height={16} className={classNames(className, 'w-4 h-4')} />
  </SelectPrimitive.Icon>
))

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <>
    <SelectPrimitive.Trigger
      ref={ref}
      className={classNames(
        'h-[54px] data-[state=open]:bg-accent group relative rounded-xl flex items-center justify-between gap-1 w-full text-gray-900 dark:text-slate-50 bg-secondary px-4',
        className
      )}
      {...props}
    >
      {children}
      <SelectIcon />
    </SelectPrimitive.Trigger>
  </>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, collisionPadding = 8, sideOffset = 4, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      collisionPadding={collisionPadding}
      sideOffset={sideOffset}
      className={classNames(
        'p-0.5 relative z-[1081] min-w-[8rem] rounded-xl overflow-hidden bg-white/50 paper dark:bg-slate-800/50 shadow-md animate-in fade-in-80',
        position === 'popper' && 'translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={classNames(
          'p-1',
          position === 'popper' && 'h-[var(--radix-select-trigger-height)]  min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <>
    <input value={props['aria-label']} placeholder="hidden placeholder" className="hidden peer" />
    <SelectPrimitive.Label
      ref={ref}
      className={classNames(
        'pointer-events-none font-medium peer-focus:font-normal absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-[15px] scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[15px]',
        className
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
      'text-gray-700 dark:text-slate-300 relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none hover:bg-muted focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon strokeWidth={3} width={16} height={16} className="text-blue" />
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
  <SelectPrimitive.Separator ref={ref} className={classNames('-mx-1 my-1 h-px bg-muted', className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

const SelectCaption: FC<{ caption?: string; isError?: boolean }> = ({ caption, isError }) => {
  if (!caption) return <></>

  return (
    <span className={classNames(isError ? 'text-red' : '', 'mt-1.5 inline-block px-4 text-xs text-gray-500')}>
      {caption}
    </span>
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectCaption,
  SelectIcon,
}
