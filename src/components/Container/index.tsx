import { classNames } from 'app/functions'
import { ReactNode } from 'react'

export type MaxWidth = 'full' | '7xl' | '6xl' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'

const TailwindMapper: Record<MaxWidth, string> = {
  full: 'max-w-full',
  '7xl': 'max-w-7xl',
  '6xl': 'max-w-6xl',
  '5xl': 'max-w-5xl',
  '4xl': 'max-w-4xl',
  '3xl': 'max-w-3xl',
  '2xl': 'max-w-2xl',
  xl: 'max-w-xl',
  lg: 'max-w-lg',
  md: 'max-w-md',
  sm: 'max-w-sm',
  xs: 'max-w-xs',
}

interface ContainerProps {
  children: ReactNode
  maxWidth?: MaxWidth
  className?: string
  id?: string
}

const Container = ({ children, maxWidth = '2xl', className = '', id }: ContainerProps) => (
  <div className={classNames(className, TailwindMapper[maxWidth], 'w-full')} id={id}>
    {children}
  </div>
)

export default Container
