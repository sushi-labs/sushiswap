export type ShellProps = {
  children?: React.ReactNode
  className?: string
}

function Shell({ children }: ShellProps): JSX.Element {
  return <>{children}</>
}

export default Shell
