import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import classNames from 'classnames'

function SkeletonBox(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={classNames(
        props.className,
        'rounded-lg overflow-hidden animate-pulse bg-black/[0.10] dark:bg-white/[0.10]',
      )}
    />
  )
}

export interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  radius: number
}

function SkeletonCircle(props: CircleProps) {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        minWidth: props.radius,
        minHeight: props.radius,
        width: props.radius,
        height: props.radius,
      }}
      className={classNames(
        props.className,
        'rounded-full overflow-hidden animate-pulse bg-black/[0.10] dark:bg-white/[0.10]',
      )}
    />
  )
}

const skeletonTextVariants = cva('flex w-full', {
  variants: {
    fontSize: {
      xs: 'h-[18px] py-[3px]',
      sm: 'h-5 py-[3px]',
      default: 'h-6 py-[3px]',
      lg: 'h-[28px] py-[3px]',
      xl: 'h-[28px]',
      '2xl': 'h-[44px] py-[6px]',
      '3xl': 'h-[36px] py-[3px]',
    },
    align: {
      left: '',
      center: 'justify-center',
      right: 'justify-end',
    },
  },
  defaultVariants: {
    fontSize: 'default',
    align: 'left',
  },
})

export interface SkeletonTextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'>,
    VariantProps<typeof skeletonTextVariants> {}

function SkeletonText({
  className,
  align,
  fontSize,
  ...props
}: SkeletonTextProps) {
  return (
    <div
      {...props}
      className={classNames(skeletonTextVariants({ align, fontSize }))}
    >
      <div
        className={classNames(
          className,
          'flex w-full h-full rounded-md overflow-hidden animate-pulse bg-black/[0.10] dark:bg-white/[0.10]',
        )}
      />
    </div>
  )
}

export { SkeletonBox, SkeletonCircle, SkeletonText }
