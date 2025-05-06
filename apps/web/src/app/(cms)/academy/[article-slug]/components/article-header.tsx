import type { AcademyArticle } from '@sushiswap/graph-client/strapi'
import { Container } from '@sushiswap/ui'
import format from 'date-fns/format'
import type { FC } from 'react'
import { Media } from 'src/app/(cms)/components/media'
import { DifficultyLabel } from '../../components/difficulty-label'

interface ArticleHeader {
  article: AcademyArticle
}

export const ArticleHeader: FC<ArticleHeader> = ({ article }) => {
  if (!article) return null
  const product = article.products[0]

  return (
    <Container maxWidth="3xl" className={'flex flex-col items-center mx-auto'}>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center px-3 rounded-full bg-slate-800 h-6 sm:h-7">
          {article.publishedAt && (
            <time
              dateTime={article.publishedAt}
              className="text-xs font-medium text-slate-500 whitespace-nowrap"
            >
              {format(new Date(article.publishedAt), 'dd MMM yyyy')}
            </time>
          )}
          <span className="text-xs font-medium text-slate-50 sm:text-sm sm:font-normal">
            {product?.name}
          </span>
        </div>
        <DifficultyLabel article={article} />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold sm:mt-5 sm:font-medium sm:text-5xl text-slate-50">
        {article.title}
      </h1>
      <h3 className="mt-3 text-sm text-center sm:mt-5 sm:text-lg text-slate-400">
        {article.description}
      </h3>
      <ul className="flex flex-wrap justify-center gap-5 mt-4 text-sm sm:mt-8">
        {article.authors.map((author) => (
          <li
            key={author.email}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <div className="relative w-6 h-6 overflow-hidden rounded-full bg-slate-800">
              {author.avatar && <Media image={author.avatar} />}
            </div>
            <span className="text-slate-50">{author.name}</span>
          </li>
        ))}
      </ul>
    </Container>
  )
}
