export interface ShellProps {
  children?: React.ReactNode
}

export function Shell({ children }: ShellProps): JSX.Element {
  return <div className="pt-[54px]">{children}</div>
}
