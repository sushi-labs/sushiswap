import classNames from 'classnames'

export type HeaderProps = {
  brand?: JSX.Element
  nav?: JSX.Element
} & React.HTMLProps<HTMLElement>

function Header({ children, className, brand, nav, ...props }: HeaderProps): JSX.Element {
  return (
    <header className={classNames('flex justify-between h-16', className)} {...props}>
      {brand}
      {nav}
      {children}
    </header>
  )
}

export default Header
