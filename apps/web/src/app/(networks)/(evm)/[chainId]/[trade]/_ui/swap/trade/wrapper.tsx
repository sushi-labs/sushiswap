import { classNames } from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  enableBorder?: boolean
}

export const Wrapper: FC<WrapperProps> = ({
  children,
  className,
  enableBorder = false,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        'shadow-[0px_1px_2px_#0000000D] p-4 bg-white md:bg-slate-50 dark:bg-slate-800 rounded-xl',
        enableBorder && 'border border-[#EBEBEB] dark:border-[#FFFFFF14]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
