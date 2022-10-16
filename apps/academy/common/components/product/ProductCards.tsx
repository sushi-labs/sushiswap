import { Typography } from '@sushiswap/ui'
import { ComponentType, FC } from 'react'

interface ProductCard {
  title: string
  subtitle: string
  Icon: ComponentType<React.SVGProps<SVGSVGElement>>
}

interface ProductCards {
  name: string
  description: string
  cards: ProductCard[]
  gradientBorderColor?: string
}

export const ProductCards: FC<ProductCards> = ({ name, description, cards, gradientBorderColor }) => {
  return (
    <section className="py-[75px]">
      <div className="text-center">
        <Typography variant="h1" weight={700}>
          What is {name}?
        </Typography>
        <Typography className="mt-6 text-center text-gray-500" variant="lg">
          {description}
        </Typography>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] mt-24 gap-x-6 gap-y-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-px h-[415px] rounded-3xl"
            style={{
              background: !i
                ? `linear-gradient(218.8deg, ${gradientBorderColor} 2.35%, rgba(0, 0, 0, 0) 97.65%)`
                : 'unset',
            }}
          >
            <div className="p-12 h-full bg-[#212939] rounded-3xl">
              <div className="w-[95px] h-[95px]">{<card.Icon />}</div>
              <div className="mt-11">
                <Typography weight={700} variant="h3">
                  {card.title}
                </Typography>
              </div>
              <div className="mt-5">
                <Typography variant="sm" className="text-gray-500">
                  {card.subtitle}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
