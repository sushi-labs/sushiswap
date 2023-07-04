import { Button } from '@sushiswap/ui/components/button'
import { Container } from '@sushiswap/ui/components/container'
import { FC } from 'react'
import { Article } from 'types'

import { ArticleAuthors, ArticleHeader } from './article'

interface Hero {
  article: Article
}

export const Hero: FC<Hero> = ({ article }) => {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800/15 to-blue/5">
      <Container maxWidth="5xl" className="z-10 px-4 py-20 mx-auto">
        <div className="relative pt-10">
          <ArticleHeader article={article} />
          <ArticleAuthors article={article} />
          <div className="mt-8">
            <Button asChild>
              <a href={`/blog/${article?.attributes?.slug}`}>Read Article</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
