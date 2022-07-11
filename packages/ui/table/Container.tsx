import classNames from 'classnames'

export type TableContainerProps = {
  children?: React.ReactNode
  className?: string
}

function Container({ children, className }: TableContainerProps): JSX.Element {
  return (
    <div
      className={classNames(
        'overflow-hidden overflow-x-auto border bg-slate-900 border-slate-800 rounded-2xl z-10',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Container
