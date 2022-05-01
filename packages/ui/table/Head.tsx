import { TableHTMLAttributes } from 'react'

export type TableHeadProps = TableHTMLAttributes<HTMLTableSectionElement>

function Head ({ children, ...props }: TableHeadProps) { 
  return (
    <thead {...props} className="bg-dark-800/40" >
      {children}
    </thead>
  )
}

export default Head
