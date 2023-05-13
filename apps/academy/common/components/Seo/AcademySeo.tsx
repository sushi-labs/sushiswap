import { ArticleJsonLd } from 'next-seo'
import { FC } from 'react'

import { Global } from '.mesh'

interface BlogSeo {
  seo: Global
}

export const AcademySeo: FC<BlogSeo> = ({ seo }) => (
  <ArticleJsonLd
    type="Blog"
    url="https://www.sushi.com/academy"
    title={seo.siteName}
    description={seo.siteDescription}
    authorName="Sushi"
    images={[seo?.defaultSeo?.shareImage?.data?.attributes?.url as string]}
    datePublished={seo.createdAt}
    dateModified={seo.updatedAt}
  />
)

export default BlogSeo
