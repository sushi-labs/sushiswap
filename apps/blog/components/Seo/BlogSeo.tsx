import { ArticleJsonLd } from 'next-seo'
import { FC } from 'react'

import { Global } from '.mesh'

interface BlogSeo {
  seo: Global
}

export const BlogSeo: FC<BlogSeo> = ({ seo }) => (
  <ArticleJsonLd
    type="Blog"
    url="https://sushi.com/blog"
    title={seo.siteName}
    description={seo.siteDescription}
    authorName="Sushi"
    images={[seo.defaultSeo.shareImage.data.attributes.url]}
    datePublished={seo.createdAt}
    dateModified={seo.updatedAt}
  />
)

export default BlogSeo
