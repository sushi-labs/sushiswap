import classNames from 'classnames'

export type HeaderProps = {
  children?: React.ReactNode
  className?: string
  title?: JSX.Element
  nav?: JSX.Element
}

function Header({ children, className, title, nav }: HeaderProps): React.ReactNode {
  return (
    <header className={classNames('flex justify-between h-16', className)}>
      {title}
      {nav}
    </header>
  )
}

export default Header
