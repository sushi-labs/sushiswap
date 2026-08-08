import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import { Button, Container, LinkInternal } from '@sushiswap/ui'
import { cacheLife } from 'next/cache'
import { ArticleAuthors } from './article-authors'
import { ArticleHeader } from './article-header'

export async function Hero() {
  'use cache'
  cacheLife({ revalidate: 300 })

  const { articles } = await getBlogArticles({
    pagination: { start: 0, limit: 1 },
  })

  const article = articles[0]

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800/15 to-blue/5">
      <Container className="z-10 px-4 py-10 md:py-20 mx-auto" maxWidth="5xl">
        <div className="relative md:pt-10">
          <ArticleHeader article={article} />
          <ArticleAuthors article={article} />
          <div className="mt-8">
            <Button asChild>
              <LinkInternal href={`/blog/${article.slug}`}>
                Read Article
              </LinkInternal>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
