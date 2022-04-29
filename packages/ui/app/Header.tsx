type Props = {
  children?: React.ReactNode
}

function Header({ children }: Props): JSX.Element {
  return <header className="fixed z-20 hidden w-full h-16 lg:block">{children}</header>
}

export default Header
