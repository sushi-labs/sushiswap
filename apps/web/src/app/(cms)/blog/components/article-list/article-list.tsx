import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import { cacheLife } from 'next/cache'
import { ArticleListClient } from './article-list-client'

export async function ArticleList() {
  'use cache'
  cacheLife({ revalidate: 300 })

  const { articles, meta } = await getBlogArticles({
    pagination: { page: 0, pageSize: 9 },
  })

  return <ArticleListClient initialArticles={articles} initialMeta={meta} />
}
