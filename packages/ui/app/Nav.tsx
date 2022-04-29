type Props = {
  children?: React.ReactNode
}

function Nav({ children }: Props): JSX.Element {
  return <nav>{children}</nav>
}

export default Nav
