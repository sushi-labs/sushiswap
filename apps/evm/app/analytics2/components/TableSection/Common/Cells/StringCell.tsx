import { FC } from 'react'

export const StringCell: FC<{ string: string }> = ({ string }) => {
  return <p className="text-sm font-semibold  text-right text-slate-50">{string}</p>
}
