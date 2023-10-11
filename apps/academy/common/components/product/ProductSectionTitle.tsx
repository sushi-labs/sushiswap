import { FC, ReactNode } from 'react'

interface ProductSectionTitle {
  title: string
  subtitle?: ReactNode
}
export const ProductSectionTitle: FC<
  ProductSectionTitle & React.ComponentProps<'div'>
> = ({ title, subtitle, ...props }) => {
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
