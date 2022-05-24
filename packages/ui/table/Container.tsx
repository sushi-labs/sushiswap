export type TableContainerProps = {
  children?: React.ReactNode
}

function Container({ children }: TableContainerProps): JSX.Element {
  return (
    <div className="overflow-hidden overflow-x-auto border shadow-md bg-slate-900 border-slate-800 rounded-2xl">
      {children}
    </div>
  )
}

export default Container
