import classNames from 'classnames'

export interface HeaderProps extends React.HTMLProps<HTMLElement> {
  brand?: JSX.Element
  nav?: JSX.Element
}

export function Header({ children, className, brand, nav, ...props }: HeaderProps): JSX.Element {
  return (
    <header className={classNames('flex justify-between', className)} {...props}>
      {brand}
      {nav}
      {children}
    </header>
  )
}

export default Header
