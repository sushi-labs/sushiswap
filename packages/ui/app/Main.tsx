export type MainProps = React.HTMLProps<HTMLElement>

export function Main({ children, className }: MainProps): JSX.Element {
  return <main className={className}>{children}</main>
}

export default Main
