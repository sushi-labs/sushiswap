import { Button, Container, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { FC } from 'react'

import { Article } from '../types'

interface Hero {
  article: Article
}

export const Hero: FC<Hero> = ({ article }) => {
  return (
    <section className="bg-slate-900/80 ">
      <Container maxWidth="5xl" className="mx-auto px-4 z-10">
        <div className="flex flex-col py-20 gap-5 max-w-[500px]">
          <Typography variant="sm" className="text-slate-500">
            Latest From Sushi Blog <br />
            {format(new Date(article.attributes.createdAt), 'dd MMM yyyy')}
          </Typography>
          <Typography weight={900} variant="h2" className="text-slate-100 tracking-wide">
            {article.attributes.title}
          </Typography>
          <Typography variant="xl" className="text-slate-100">
            {article.attributes.description}
          </Typography>
          <div>
            <Button
              as="a"
              href={`/blog/${article.attributes.slug}`}
              color="blue"
              className="inline-flex transition-all hover:ring-4 focus:ring-4 text-sm sm:text-base text-slate-50 px-6 h-[44px] sm:!h-[44px]"
            >
              Read Article
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
