import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Container } from '@sushiswap/ui/components/container'
import type { FC } from 'react'
import type { GhostArticle } from 'lib/ghost'
import { ArticleAuthors, ArticleHeader } from './article'

interface Hero {
  article: GhostArticle
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
              <LinkInternal href={`/${article.attributes.slug}`}>
                Read Article
              </LinkInternal>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
