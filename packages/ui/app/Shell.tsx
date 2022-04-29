type Props = {
  children?: React.ReactNode
}

function Shell({ children }: Props): JSX.Element {
  return <div>{children}</div>
}

export default Shell
