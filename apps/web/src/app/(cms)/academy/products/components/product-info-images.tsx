import { classNames } from '@sushiswap/ui'
import { RouterImg } from '../assets/router-img'
import { TokensBoardImg } from '../assets/tokens-board-img'
import { TokensPanelImg } from '../assets/tokens-panel-img'

import type { JSX } from 'react'

interface ProductInfoSection {
  title: string
  description: string
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

interface ProductInfoImages {
  color: string
  secondaryColor: string
  infoSections: [ProductInfoSection, ProductInfoSection, ProductInfoSection]
}

function ProductInfoSection({
  title,
  description,
  startIcon,
  endIcon,
}: ProductInfoSection) {
  return (
    <div
      className={classNames(
        'md:grid items-center gap-20 bg-slate-800 rounded-xl p-6 md:p-0 md:bg-transparent',
        startIcon ? 'grid-cols-[360px,1fr]' : 'grid-cols-[1fr,360px]',
      )}
    >
      {startIcon}
      <div>
        <h3 className="text-xl md:text-4xl text-slate-50">{title}</h3>
        <p className="text-sm md:text-lg text-slate-400">{description}</p>
      </div>
      {endIcon}
    </div>
  )
}

export function ProductInfoImages({
  color,
  secondaryColor,
  infoSections,
}: ProductInfoImages) {
  const [firstSection, secondSection, thirdSection] = infoSections
  return (
    <section className="py-10 md:py-[75px] grid grid-rows-[repeat(3,minmax(auto,1fr)] gap-4 md:gap-[70px]">
      <ProductInfoSection
        title={firstSection.title}
        description={firstSection.description}
        endIcon={
          <TokensPanelImg
            color={color}
            secondaryColor={secondaryColor}
            className="hidden md:block"
          />
        }
      />
      <ProductInfoSection
        title={secondSection.title}
        description={secondSection.description}
        startIcon={
          <RouterImg
            color={color}
            secondaryColor={secondaryColor}
            className="hidden md:block"
          />
        }
      />
      <ProductInfoSection
        title={thirdSection.title}
        description={thirdSection.description}
        endIcon={
          <TokensBoardImg
            color={color}
            secondaryColor={secondaryColor}
            className="hidden md:block"
          />
        }
      />
    </section>
  )
}
