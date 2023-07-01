import { classNames } from '@sushiswap/ui'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { format } from 'date-fns'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'
import { DifficultyLabel, Image } from '../'
import { Container } from '@sushiswap/ui/components/container'

interface ArticleHeader {
  article?: ArticleEntity
}

export const ArticleHeader: FC<ArticleHeader> = ({ article }) => {
  if (!article) return null
  const product = article.attributes?.products?.data?.[0]?.attributes

  return (
    <Container
      maxWidth="3xl"
      className={classNames(DEFAULT_SIDE_PADDING, 'flex flex-col items-center mt-10 sm:mt-0 mx-auto')}
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2.5 px-3 rounded-full bg-slate-800 h-6 sm:h-7">
          {article.attributes?.publishedAt && (
            <time
              dateTime={article.attributes.publishedAt}
              className="text-xs font-medium text-slate-500 whitespace-nowrap"
            >
              {format(new Date(article.attributes.publishedAt), 'dd MMM yyyy')}
            </time>
          )}
          <span className="text-xs font-medium text-slate-50 sm:text-sm sm:font-normal">{product?.name}</span>
        </div>
        <DifficultyLabel article={article} />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold sm:mt-5 sm:font-medium sm:text-5xl text-slate-50">
        {article.attributes?.title}
      </h1>
      <h3 className="mt-3 text-sm text-center sm:mt-5 sm:text-lg text-slate-400">{article.attributes?.description}</h3>
      <ul className="flex flex-wrap justify-center gap-5 mt-4 text-sm sm:mt-8">
        {article.attributes?.authors?.data.map((author, index) => (
          <li key={index} className="flex items-center gap-2 whitespace-nowrap">
            <div className="relative w-6 h-6 overflow-hidden rounded-full bg-slate-800">
              {author?.attributes?.avatar.data && <Image image={author?.attributes.avatar.data} />}
            </div>
            <span className="text-slate-50">{author?.attributes?.name}</span>
          </li>
        ))}
      </ul>
    </Container>
  )
}
