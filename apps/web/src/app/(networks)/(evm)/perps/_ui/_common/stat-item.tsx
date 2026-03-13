import type { ReactNode } from 'react'

export const StatItem = ({
  title,
  value,
}: {
  title: ReactNode
  value: ReactNode
}) => {
  return (
    <div className="grid grid-cols-2 text-xs font-medium">
      <div className="text-[#6A7282]">{title}</div>
      <div className="justify-end text-[#99A1AF] flex whitespace-nowrap">
        {value}
      </div>
    </div>
  )
}
