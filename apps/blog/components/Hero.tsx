import { Button, Container, LinkInternal } from '@sushiswap/ui'
import { Article } from 'lib/strapi/article'
import type { FC } from 'react'
import { ArticleAuthors, ArticleHeader } from './article'

interface Hero {
  article: Article
}

export const Hero: FC<Hero> = ({ article }) => {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800/15 to-blue/5">
      <Container className="z-10 px-4 py-20 mx-auto" maxWidth="5xl">
        <div className="relative pt-10">
          <ArticleHeader article={article} />
          <ArticleAuthors article={article} />
          <div className="mt-8">
            <Button asChild>
              <LinkInternal href={`/${article.slug}`}>
                Read Article
              </LinkInternal>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
