import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import { cacheLife } from 'next/cache'
import { connection } from 'next/server'

// For Mava's scraper
async function ArticleListPage() {
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

export default async function Page() {
  await connection()

  return <ArticleListPage />
}
