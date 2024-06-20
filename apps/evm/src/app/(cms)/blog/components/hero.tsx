import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import { Button, Container, LinkInternal } from '@sushiswap/ui'
import { ArticleAuthors } from './article-authors'
import { ArticleHeader } from './article-header'

export const revalidate = 900

export async function Hero() {
  const { articles } = await getBlogArticles({
    pagination: { start: 0, limit: 1 },
  })

  const article = articles[0]

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800/15 to-blue/5">
      <Container className="z-10 px-4 py-20 mx-auto" maxWidth="5xl">
        <div className="relative pt-10">
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
