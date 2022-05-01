export type NavProps = {
  children?: React.ReactNode
  className?: string
}

function Nav({ children, className }: NavProps): JSX.Element {
  return <nav className={className}>{children}</nav>
}

export default Nav
