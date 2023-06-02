'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

import { cn } from '../../lib/utils'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'
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
      <SelectPrimitive.Value ref={ref} className={cn(className)} {...props}></SelectPrimitive.Value>
    </div>
  )
})
SelectValue.displayName = SelectPrimitive.Value.displayName

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <>
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'h-[54px] group relative rounded-xl flex items-center justify-between gap-1 w-full text-gray-900 dark:text-slate-50 bg-gray-200 dark:bg-slate-200/[0.04] px-4',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <div className="bg-black/[0.05] dark:bg-white/[0.08] hover:dark:bg-white/[0.16] hover:bg-gray-300 rounded-full p-0.5">
          <ChevronUpDownIcon width={20} height={20} className="text-gray-600 dark:text-slate-400" />
        </div>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  </>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] rounded-xl overflow-hidden bg-white/50 paper dark:bg-slate-800/50 shadow-md animate-in fade-in-80',
        position === 'popper' && 'translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
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
    <input value={props['aria-label']} placeholder="hidden placeholder" className="peer hidden" />
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
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
    className={cn(
      'text-gray-700 dark:text-slate-300 relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none hover:bg-black/[0.03] hover:dark:bg-white/[0.03] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon width={16} height={16} />
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
  <SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
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
}
