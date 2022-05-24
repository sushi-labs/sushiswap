import classNames from 'classnames'

export interface HeaderProps extends React.HTMLProps<HTMLElement> {
  brand?: JSX.Element
  nav?: JSX.Element
}

export function Header({ children, className, brand, nav, ...props }: HeaderProps): JSX.Element {
  return (
    <header className={classNames('grid grid-cols-3 items-center', className)} {...props}>
      {brand}
      <div className="flex justify-center">{nav}</div>
      <div className="flex justify-end">{children}</div>
    </header>
  )
}

export default Header
