import { Button, Container } from '@sushiswap/ui'
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
          <Button
            as="a"
            href={`/blog/${article?.attributes?.slug}`}
            color="blue"
            className="mt-8 inline-flex transition-all hover:ring-4 focus:ring-4 text-sm text-slate-50 px-6 h-[40px] sm:!h-[40px]"
          >
            Read Article
          </Button>
        </div>
      </Container>
    </section>
  )
}
