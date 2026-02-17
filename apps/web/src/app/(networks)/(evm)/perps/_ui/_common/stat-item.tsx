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
      <div className="text-muted-foreground">{title}</div>
      <div className="justify-end flex">{value}</div>
    </div>
  )
}
