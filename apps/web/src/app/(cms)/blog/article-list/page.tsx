import { getBlogArticles } from '@sushiswap/graph-client/strapi'

export const revalidate = 3600

// For Mava's scraper
export default async function Page() {
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
