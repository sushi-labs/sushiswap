'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

import { classNames } from '../index'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={classNames('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {props.defaultValue ? (
      props.defaultValue.map((el, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-5 w-5 rounded-full border-2 border-primary bg-blue hover:ring-4 !ring-offset-0 ring-accent transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        />
      ))
    ) : props.value ? (
      props.value.map((el, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-5 w-5 rounded-full border-2 border-primary bg-blue hover:ring-4 !ring-offset-0 ring-accent transition-colors disabled:pointer-events-none disabled:opacity-50"
        />
      ))
    ) : (
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-blue hover:ring-4 !ring-offset-0 ring-accent transition-colors disabled:pointer-events-none disabled:opacity-50" />
    )}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
