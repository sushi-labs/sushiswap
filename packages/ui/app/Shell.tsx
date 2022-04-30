type Props = {
  children?: React.ReactNode
}

function Shell({ children }: Props): JSX.Element {
  return <>{children}</>
}

export default Shell
