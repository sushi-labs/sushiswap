'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as React from 'react'

import classNames from 'classnames'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={classNames(
      'peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 focus:border-2 border-transparent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-blue disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue dark:data-[state=checked]:bg-skyblue',
      'data-[state=unchecked]:bg-black/[0.10]',
      'dark:data-[state=unchecked]:bg-white/[0.10]',
      'black:data-[state=unchecked]:bg-white/[0.10]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={classNames(
        'pointer-events-none transition-colors block h-5 w-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        'data-[state=unchecked]:bg-gray-50 data-[state=checked]:bg-white',
        'dark:data-[state=unchecked]:bg-slate-50 dark:data-[state=checked]:bg-white',
        'black:data-[state=unchecked]:bg-black black:data-[state=checked]:bg-white',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
