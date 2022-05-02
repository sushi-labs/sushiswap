import classNames from 'classnames'

export type HeaderProps = {
  children?: React.ReactNode
  className?: string
  title?: JSX.Element
  nav?: JSX.Element
} & React.HTMLProps<HTMLElement>

function Header({ children, className, title, nav }: HeaderProps): JSX.Element {
  return (
    <header className={classNames('flex justify-between h-16', className)}>
      {title}
      {nav}
      {children}
    </header>
  )
}

export default Header
