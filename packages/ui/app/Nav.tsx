export interface NavProps extends React.HTMLProps<HTMLElement> {}

export function Nav({ children, className }: NavProps): JSX.Element {
  return <nav className={className}>{children}</nav>
}

export default Nav
