import { Button, LinkInternal } from '@sushiswap/ui'

import type { AcademyArticle } from '@sushiswap/graph-client/strapi'
import { ArticleList } from '../../components/article-list/article-list'
import { ProductSectionTitle } from './product-section-title'

interface ProductArticles {
  title: string
  productName: string
  articles: AcademyArticle[]
  subtitle: string
}

export function ProductArticles({
  title,
  productName,
  articles,
  subtitle,
}: ProductArticles) {
  return (
    <section className="py-10 sm:py-[75px]">
      <div className="flex items-center justify-between w-full">
        <ProductSectionTitle title={title} subtitle={subtitle} />

        <LinkInternal href={`?product=${productName}`}>
          <Button variant="secondary">View All</Button>
        </LinkInternal>
      </div>
      <div className="mt-8 sm:mt-20">
        <ArticleList
          className="grid grid-cols-1 gap-4 transition-all sm:grid-cols-2 md:grid-cols-3"
          articles={articles}
        />
      </div>
    </section>
  )
}
