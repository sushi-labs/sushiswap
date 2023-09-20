import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { FC } from 'react'
import { Article } from 'types'

import { ArticleList } from '../ArticleList'
import { Card } from '../Card'
import { ProductSectionTitle } from './ProductSectionTitle'

interface ProductArticles {
  title: string
  productName: string
  articles: Article[]
  subtitle: string
  isLoading: boolean
}

export const ProductArticles: FC<ProductArticles> = ({ title, productName, articles, subtitle, isLoading }) => {
  return (
    <section className="py-10 sm:py-[75px]">
      <div className="flex items-center justify-between w-full">
        <ProductSectionTitle title={title} subtitle={subtitle} />

        <LinkInternal href={`?product=${productName}`}>
          <Button variant="secondary">View All</Button>
        </LinkInternal>
      </div>
      <div className="mt-8 sm:mt-20">
        {articles && (
          <div className="grid grid-cols-1 gap-4 transition-all sm:grid-cols-2 md:grid-cols-3">
            <ArticleList
              skeletonAmount={3}
              articles={articles}
              loading={isLoading}
              render={(article) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
            />
          </div>
        )}
      </div>
    </section>
  )
}
