import { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}
export function Card({ children }: Props) {
  return <div className="bg-slate-700 rounded-lg">{children}</div>
}
