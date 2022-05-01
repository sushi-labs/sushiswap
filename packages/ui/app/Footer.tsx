export type FooterProps = {
  children?: React.ReactNode
  className?: string
}

function Footer({ children }: FooterProps): JSX.Element {
  return <footer>{children}</footer>
}

export default Footer
