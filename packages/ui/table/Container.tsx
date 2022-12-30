import classNames from 'classnames'

export type TableContainerProps = {
  children?: React.ReactNode
  className?: string
}

function Container({ children, className }: TableContainerProps): JSX.Element {
  return <div className={classNames(className)}>{children}</div>
}

export default Container
