import { classNames } from '@sushiswap/ui'

const roundedToPx = {
  sm: 'rounded-[1px]',
  md: 'rounded-[5px]',
  lg: 'rounded-[7px]',
  xl: 'rounded-[11px]',
  '2xl': 'rounded-[15px]',
  full: 'rounded-[9998px]',
}

const roundedClass = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}
export const PerpsCard = ({
  children,
  className,
  fullHeight = false,
  rounded = 'xl',
  backdropBlur = false,
}: {
  children: React.ReactNode
  className?: string
  fullHeight?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  backdropBlur?: boolean
}) => {
  return (
    <div
      className={classNames(
        'p-[1px]',
        'bg-[linear-gradient(180deg,rgba(237,241,243,0.05)_0%,rgba(237,241,243,0.015)_100%)]',
        fullHeight ? 'h-full' : '',
        roundedClass[rounded],
      )}
    >
      <div
        className={classNames(
          'bg-perps-background/[20%] shadow-[inset_1.5px_2px_1px_-2px_rgba(255,255,255,0.2),inset_-1.5px_-1.5px_1px_-2px_rgba(255,255,255,0.125)]',
          fullHeight ? 'h-full' : '',
          backdropBlur ? 'backdrop-blur-lg' : '',
          roundedToPx[rounded],
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
