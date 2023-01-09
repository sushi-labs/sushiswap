import { FC, HTMLProps } from 'react'
import classNames from 'classnames'

export interface TextProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  align?: 'left' | 'right' | 'center'
  fontSize?:
    | 'text-xs'
    | 'text-sm'
    | 'text-base'
    | 'text-lg'
    | 'text-xl'
    | 'text-2xl'
    | 'text-3xl'
    | 'text-4xl'
    | 'text-5xl'
    | 'text-6xl'
    | 'text-7xl'
    | 'text-8xl'
    | 'text-9x;'
}

const STYLES = {
  'text-xs': 'h-[18px]',
  'text-sm': 'h-5',
  'text-base': 'h-[22px]',
  'text-lg': 'h-6',
  'text-xl': 'h-[28px]',
  'text-2xl': 'h-7',
  'text-3xl': 'h-[30px]',
  'text-4xl': 'h-8',
  'text-5xl': 'h-[34px]',
  'text-6xl': 'h-9',
  'text-7xl': 'h-[38px]',
  'text-8xl': 'h-10',
  'text-9x;': 'h-[42px]',
}

const ALIGN = {
  left: '',
  center: 'justify-center',
  right: 'justify-end',
}

export const Text: FC<TextProps> = ({ align = 'left', className, fontSize = 'text-base', ...props }) => {
  return (
    <div {...props} className={classNames(ALIGN[align], STYLES[fontSize], 'flex w-full py-[3px]')}>
      <div
        className={classNames(
          className,
          'flex w-full h-full bg-gray-200 dark:bg-slate-700 rounded-md overflow-hidden shimmer'
        )}
      />
    </div>
  )
}
