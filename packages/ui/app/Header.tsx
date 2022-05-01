import { classNames } from 'classnames'

export type HeaderProps = {
  children?: React.ReactNode
  className?: string
}

function Header({ children, className }: HeaderProps): JSX.Element {
  return <header className={classNames('fixed z-20 hidden w-full h-16 lg:block', className)}>{children}</header>
}

export default Header
