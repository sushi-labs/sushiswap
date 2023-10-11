import { ComponentType, FC } from 'react'

import { ProductSectionTitle } from '.'

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

export const ProductCards: FC<ProductCards> = ({
  name,
  description,
  cards,
  gradientBorderColor,
}) => {
  return (
    <section className="py-10 sm:py-[75px]">
      <ProductSectionTitle
        title={`What is ${name}?`}
        subtitle={description}
        className="text-center"
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] mt-10 sm:mt-[70px] gap-x-6 gap-y-4 sm:gap-y-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-px sm:h-[420px] rounded-3xl"
            style={{
              background: !i
                ? `linear-gradient(218.8deg, ${gradientBorderColor} 2.35%, rgba(0, 0, 0, 0) 97.65%)`
                : 'unset',
            }}
          >
            <div className="p-8 md:p-12 h-full bg-[#212939] rounded-3xl">
              <card.Icon />
              <div className="mt-6 sm:mt-10">
                <h3 className="text-xl sm:text-2xl font-bold">{card.title}</h3>
              </div>
              <div className="mt-2 sm:mt-4">
                <p className="text-slate-400 text-xs sm:text-sm">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
