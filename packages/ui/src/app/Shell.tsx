export interface ShellProps {
  children?: React.ReactNode
}

export function Shell({ children }: ShellProps): JSX.Element {
  return <div className="min-h-screen">{children}</div>
}
