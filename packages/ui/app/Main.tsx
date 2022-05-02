export type MainProps = {
  children?: React.ReactNode
  className?: string
}

export function Main({ children, className }: MainProps): JSX.Element {
  return <main className={className}>{children}</main>
}

export default Main
