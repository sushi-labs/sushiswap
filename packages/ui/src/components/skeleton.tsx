import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

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

type ChartType = 'area' | 'bar'

function ChartLoadingStateMask({
  type,
  height,
}: { type: ChartType; height: number }) {
  switch (type) {
    case 'area':
      return (
        <g transform={`translate(0, ${height - 16}) scale(1,-1)`}>
          <defs>
            <pattern
              id="wavePattern"
              patternUnits="userSpaceOnUse"
              width="200"
              height={height}
            >
              <path
                d="M-150 170 Q-100 90, -50 170 T50 170 T150 170 T250 170 V0 H-150 Z"
                className="fill-black/[0.10] dark:fill-white/[0.10]"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height={height}
            fill="url(#wavePattern)"
            className="animate-pulse"
          />
        </g>
      )
    case 'bar':
      return (
        <g transform={`translate(0, ${height - 16}) scale(1,-1)`}>
          {Array.from({ length: 25 }).map((_, i) => {
            const _height = Math.random() * height * 0.8 + 20
            return (
              <rect
                key={i}
                rx="3"
                width="3%"
                height={_height}
                x={`${i * 4}%`}
                className="fill-black/[0.10] dark:fill-white/[0.10] animate-pulse"
              />
            )
          })}
        </g>
      )
    default:
      return null
  }
}

function SkeletonChartAxis({
  height,
}: {
  height: number
}) {
  return (
    <g transform={`translate(0, ${height - 6})`}>
      <rect
        width="7%"
        height="6"
        rx="3"
        x="10%"
        className={'fill-black/[0.10] dark:fill-white/[0.10]'}
      />
      <rect
        width="7%"
        height="6"
        rx="3"
        x="28.25%"
        className={'fill-black/[0.10] dark:fill-white/[0.10]'}
      />
      <rect
        width="7%"
        height="6"
        rx="3"
        x="46.5%"
        className={'fill-black/[0.10] dark:fill-white/[0.10]'}
      />
      <rect
        width="7%"
        height="6"
        rx="3"
        x="64.75%"
        className={'fill-black/[0.10] dark:fill-white/[0.10]'}
      />
      <rect
        width="7%"
        height="6"
        rx="3"
        x="83%"
        className={'fill-black/[0.10] dark:fill-white/[0.10]'}
      />
    </g>
  )
}

function SkeletonChart({
  height,
  type,
}: {
  height: number
  type: ChartType
}) {
  return (
    <div className="relative">
      <svg
        width="100%"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <SkeletonChartAxis height={height} />
        <ChartLoadingStateMask type={type} height={height} />
      </svg>
    </div>
  )
}

export { SkeletonBox, SkeletonCircle, SkeletonText, SkeletonChart }
