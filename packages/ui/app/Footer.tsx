export interface FooterProps extends React.HTMLProps<HTMLElement> {}

export function Footer({ children }: FooterProps): JSX.Element {
  return <footer>{children}</footer>
}

export default Footer
