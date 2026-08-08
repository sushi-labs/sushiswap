import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import { cacheLife } from 'next/cache'

// For Mava's scraper
export default async function Page() {
  'use cache'
  cacheLife({ revalidate: 3600 })

  const { articles } = await getBlogArticles({
    pagination: {
      limit: 10_000,
    },
  })

  return (
    <div className="flex flex-col">
      {articles.map((article) => (
        <a key={article.id} href={`/blog/${article.slug}`}>
          {article.title}
        </a>
      ))}
    </div>
  )
}
