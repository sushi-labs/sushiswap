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
  'text-base': 'h-[24px]',
  'text-lg': 'h-[28px]',
  'text-xl': 'h-[28px]',
  'text-2xl': 'h-[44px]',
  'text-3xl': 'h-[36px]',
  'text-4xl': 'h-[40px]',
  'text-5xl': 'h-[34px]',
  'text-6xl': 'h-9',
  'text-7xl': 'h-[38px]',
  'text-8xl': 'h-10',
  'text-9x;': 'h-[42px]',
}

const PADDING = {
  'text-xs': 'py-[3px]',
  'text-sm': 'py-[3px]',
  'text-base': 'py-[3px]',
  'text-lg': 'py-[3px]',
  'text-xl': 'py-[3px]',
  'text-2xl': 'py-[6px]',
  'text-3xl': 'py-[3px]',
  'text-4xl': 'py-[3px]',
  'text-5xl': 'py-[3px]',
  'text-6xl': 'py-[3px]',
  'text-7xl': 'py-[3px]',
  'text-8xl': 'py-[3px]',
  'text-9x;': 'py-[3px]',
}

const ALIGN = {
  left: '',
  center: 'justify-center',
  right: 'justify-end',
}

export const Text: FC<TextProps> = ({ align = 'left', className, fontSize = 'text-base', ...props }) => {
  return (
    <div {...props} className={classNames(ALIGN[align], STYLES[fontSize], PADDING[fontSize], 'flex w-full')}>
      <div
        className={classNames(
          className,
          'flex w-full h-full rounded-md overflow-hidden animate-pulse bg-black/[0.10] dark:bg-white/[0.10]'
        )}
      />
    </div>
  )
}
