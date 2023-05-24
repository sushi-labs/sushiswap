import classNames from 'classnames'

export type TableContainerProps = {
  children?: React.ReactNode
  className?: string
  testId?: string
}

function Container({ children, testId, className }: TableContainerProps): JSX.Element {
  return (
    <div testdata-id={testId} className={classNames(className)}>
      {children}
    </div>
  )
}

export default Container
