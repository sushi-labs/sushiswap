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

type ChartType = 'line' | 'bar' | 'bar2'

function ChartLoadingStateMask({
  type,
  height,
}: { type: ChartType; height: number }) {
  switch (type) {
    case 'line':
      return (
        <>
          <path
            transform="translate(5, 75)"
            d="M0 122.5L7.26 116.158L14.52 109.916L21.78 103.873L29.04 98.1233L36.3 92.7582L43.56 87.862L50.82 83.5121L58.08 79.7771L65.34 76.7159L72.6 74.3767L79.86 72.7964L87.12 72H94.38L101.64 72.7964L108.9 74.3767L116.16 76.7159L123.42 79.7771L130.68 83.5121L137.94 87.862L145.2 92.7582L152.46 98.1233L159.72 103.873L166.98 109.916L174.24 116.158L181.5 122.5L188.76 128.842L196.02 135.084L203.28 141.127L210.54 146.877L217.8 152.242L225.06 157.138L232.32 161.488L239.58 165.223L246.84 168.284L254.1 170.623L261.36 172.204L268.62 173H275.88L283.14 172.204L290.4 170.623L297.66 168.284L304.92 165.223L312.18 161.488L319.44 157.138L326.7 152.242L333.96 146.877L341.22 141.127L348.48 135.084L355.74 128.842L363 122.5L370.26 116.158L377.52 109.916L384.78 103.873L392.04 98.1233L399.3 92.7582L406.56 87.862L413.82 83.5121L421.08 79.7771L428.34 76.7159L435.6 74.3767L442.86 72.7964L450.12 72L457.38 72L464.64 72.7964L471.9 74.3767L479.16 76.7159L486.42 79.7771L493.68 83.5121L500.94 87.862L508.2 92.7582L515.46 98.1233L522.72 103.873L529.98 109.916L537.24 116.158L544.5 122.5L551.76 128.842L559.02 135.084L566.28 141.127L573.54 146.877L580.8 152.242L588.06 157.138L595.32 161.488L602.58 165.223L609.84 168.284L617.1 170.623L624.36 172.204L631.62 173H638.88L646.14 172.204L653.4 170.623L660.66 168.284L667.92 165.223L675.18 161.488L682.44 157.138L689.7 152.242L696.96 146.877L704.22 141.127L711.48 135.084L718.74 128.842L726 122.5"
            strokeWidth="4"
            strokeLinecap="round"
            className="stroke-black/[0.10] dark:stroke-white/[0.10] animate-pulse"
          />
        </>
      )
    case 'bar':
      return (
        <g transform={`translate(0, ${height - 60}) scale(1,-1)`}>
          {Array.from({ length: 30 }).map((_, i) => {
            const _height = Math.random() * height * 0.8 + 20
            return (
              <rect
                key={i}
                rx="3"
                width="3.3%" // Adjusted width to fit 30 bars
                height={_height}
                x={`${i * 3.4}%`} // Adjusted x position to ensure even spacing
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

function ChartSkeletonAxes({
  height,
}: {
  height: number
}) {
  return (
    <g transform={`translate(0, ${height - 50})`}>
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
  type: 'line' | 'bar'
}) {
  return (
    <div className="relative">
      <svg
        width="100%"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <ChartSkeletonAxes height={height} />
        <ChartLoadingStateMask type={type} height={height} />
      </svg>
    </div>
  )
}

export { SkeletonBox, SkeletonCircle, SkeletonText, SkeletonChart }
