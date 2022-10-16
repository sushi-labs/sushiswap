import { FC } from 'react'

interface ProductStat {
  name: string
  value: string
}

interface ProductStats {
  productStats: ProductStat[]
}

export const ProductStats: FC<ProductStats> = ({ productStats }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,155px))] gap-[60px] mt-[70px]">
      {productStats.map(({ name, value }) => (
        <div key={name} className="grid grid-rows-2 gap-2">
          <p className="text-3xl font-bold text-slate-50">{value}</p>
          <p className="text-slate-300">{name}</p>
        </div>
      ))}
    </div>
  )
}
