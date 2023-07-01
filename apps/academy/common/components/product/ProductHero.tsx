import { useBreakpoint } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { FC, ReactNode, useLayoutEffect, useState } from 'react'

import { ProductStat, ProductStats } from './'
import { Button } from '@sushiswap/ui/components/button'
import { IconComponent } from '@sushiswap/ui/types'

interface ProductHero {
  productName: ReactNode
  productDescription: string
  productUrl: string
  buttonIcon: IconComponent
  buttonText?: string
  image?: JSX.Element
  productStats?: ProductStat[]
}

const Title: FC<{ productName: ReactNode; isCentered: boolean }> = ({ productName, isCentered }) => (
  <>
    {typeof productName === 'string'
      ? productName.split('-').map((name, i) => (
          <h1
            key={i}
            className={classNames('text-4xl sm:text-6xl font-bold sm:leading-[78px]', isCentered && 'text-center')}
          >
            {name}
          </h1>
        ))
      : productName}
  </>
)

export const ProductHero: FC<ProductHero> = ({
  productName,
  productDescription,
  productUrl,
  buttonText = 'Enter App',
  buttonIcon,
  image,
  productStats,
}) => {
  const { isMd } = useBreakpoint('md')

  const [isCentered, setIsCentered] = useState(false)
  useLayoutEffect(() => {
    setIsCentered(!image || !isMd)
  }, [image, isMd])

  return (
    <section className={classNames('py-10 sm:py-[75px] relative')}>
      <div className={classNames(!isCentered && 'grid md:grid-cols-2')}>
        <div className={classNames(isCentered && 'flex flex-col items-center')}>
          <Title productName={productName} isCentered={isCentered} />

          <h3 className={classNames('sm:text-2xl mt-1.5 font-medium text-slate-400', isCentered && 'text-center')}>
            {productDescription}
          </h3>

          <Button asChild className="mt-16" icon={buttonIcon}>
            <a href={productUrl}>{buttonText}</a>
          </Button>
        </div>
        {image && <div className="hidden md:block">{image}</div>}
      </div>

      {productStats && <ProductStats productStats={productStats} isCentered={isCentered} />}
    </section>
  )
}
