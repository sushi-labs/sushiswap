import type { ReactNode } from 'react'

interface ProductSectionTitle extends React.ComponentProps<'div'> {
  title: string
  subtitle?: ReactNode
}

export function ProductSectionTitle({
  title,
  subtitle,
  ...props
}: ProductSectionTitle) {
  return (
    <div {...props}>
      <h1 className="font-bold text-2xl sm:text-4xl">{title}</h1>
      {subtitle && (
        <div className="sm:mt-6 text-slate-400 text-sm sm:text-lg">
          {subtitle}
        </div>
      )}
    </div>
  )
}
