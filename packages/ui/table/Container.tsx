export type TableContainerProps = {
  children?: React.ReactNode
}

function Container({ children }: TableContainerProps): JSX.Element {
  return (
    <div className="overflow-hidden overflow-x-auto border shadow-md bg-dark-900 border-dark-800 rounded-2xl shadow-dark-1000">
      {children}
    </div>
  )
}

export default Container
