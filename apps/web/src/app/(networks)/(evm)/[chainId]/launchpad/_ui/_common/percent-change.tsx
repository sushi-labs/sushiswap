import { classNames } from '@sushiswap/ui'
import { formatPercent } from '../../_lib/format'

export const PercentChange = ({
  value,
  className,
  iconType = 'triangle',
}: {
  value: number | null | undefined
  className?: string
  iconType?: 'triangle' | 'sign'
}): React.ReactElement | null => {
  const formattedValue =
    iconType === 'triangle'
      ? formatPercent(value)?.replaceAll('+', '')?.replaceAll('-', '')
      : formatPercent(value)

  return (
    <div
      className={classNames(
        `text-sm font-bold flex items-center gap-0.5 ${
          value === null || value === undefined
            ? 'text-perps-muted-50'
            : value >= 0
              ? 'text-perps-green'
              : 'text-perps-red'
        }`,
        className,
      )}
    >
      {value === null || value === undefined || iconType === 'sign' ? null : (
        <div>
          <TriangleIcon
            className={`${
              value >= 0 ? '-rotate-90' : 'rotate-90'
            } animate-pulse !duration-[3000]`}
            width={8}
            height={8}
          />
        </div>
      )}
      {value === null || value === undefined ? '0.00%' : formattedValue}
    </div>
  )
}

const TriangleIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg
      width="4"
      height="8"
      viewBox="0 0 4 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 4L0 8L-3.49691e-07 0L4 4Z" fill="currentcolor" />
    </svg>
  )
}
21
