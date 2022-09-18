import { Typography } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'

interface ProductCard {
  title: string
  subtitle: string
  img: ReactNode
  gradientBorderColor?: string
}

export const ProductCard: FC<ProductCard> = ({ title, subtitle, img, gradientBorderColor }) => {
  return (
    <div
      className="p-[1px] h-[415px] rounded-3xl"
      style={{
        background: `linear-gradient(218.8deg, ${gradientBorderColor} 2.35%, rgba(0, 0, 0, 0) 97.65%)`,
      }}
    >
      <div className="p-12 h-full bg-[#212939] rounded-3xl">
        <div className="w-[95px] h-[95px]">{img}</div>
        <div className="mt-11">
          <Typography weight={700} variant="h3">
            {title}
          </Typography>
        </div>
        <div className="mt-5">
          <Typography variant="sm" className="text-gray-500">
            {subtitle}
          </Typography>
        </div>
      </div>
    </div>
  )
}
