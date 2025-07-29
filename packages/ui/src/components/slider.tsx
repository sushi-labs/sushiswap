'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

import classNames from 'classnames'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClassName?: string
    rangeClassName?: string
    thumbClassName?: string
  }
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={classNames(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={classNames(
        'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary black:bg-white/[0.04]',
        props?.trackClassName,
      )}
    >
      <SliderPrimitive.Range
        className={classNames(
          'absolute h-full bg-primary',
          props?.rangeClassName,
        )}
      />
    </SliderPrimitive.Track>
    {props.defaultValue ? (
      props.defaultValue.map((_el, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={classNames(
            'block h-5 w-5 rounded-full border-2 border-primary bg-blue hover:ring-4 ring-offset-background ring-accent transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
            props?.thumbClassName,
          )}
        />
      ))
    ) : props.value ? (
      props.value.map((_el, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={classNames(
            'block h-5 w-5 rounded-full border-2 border-primary bg-blue hover:ring-4 ring-offset-background ring-accent transition-colors disabled:pointer-events-none disabled:opacity-50',
            props?.thumbClassName,
          )}
        />
      ))
    ) : (
      <SliderPrimitive.Thumb
        className={classNames(
          'block h-5 w-5 rounded-full border-2 border-primary bg-blue hover:ring-4 ring-offset-background ring-accent transition-colors disabled:pointer-events-none disabled:opacity-50',
          props?.thumbClassName,
        )}
      />
    )}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
