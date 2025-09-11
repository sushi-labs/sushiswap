import { classNames } from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Wrapper: FC<WrapperProps> = (props) => {
  const { children, className, ...rest } = props
  return (
    <div
      className={classNames(
        'shadow-[0px_1px_2px_#0000000D] p-4 bg-white md:bg-slate-50 dark:bg-slate-800 rounded-xl',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
