type Props = {
  children?: React.ReactNode
}

function Footer({ children }: Props): JSX.Element {
  return <footer>{children}</footer>
}

export default Footer
