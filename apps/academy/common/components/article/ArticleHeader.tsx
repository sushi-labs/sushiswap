import { CircleIcon, classNames } from '@sushiswap/ui'
import { format } from 'date-fns'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'

interface ArticleHeader {
  article?: ArticleEntity
}

export const ArticleHeader: FC<ArticleHeader> = ({ article }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-start gap-3">
        <div
          className={classNames(
            'flex items-center gap-2 rounded-full',
            article?.attributes?.publishedAt && 'pr-3 p-px bg-slate-200'
          )}
        >
          <div className="flex items-center h-6 px-3 text-xs font-medium rounded-full bg-slate-800 text-slate-50 sm:h-7 sm:text-sm sm:font-normal">
            Furo
          </div>
          {article?.attributes?.publishedAt && (
            <time dateTime={article.attributes.publishedAt} className="text-xs text-black sm:text-sm">
              {format(new Date(article.attributes.publishedAt), 'dd MMM yyyy')}
            </time>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CircleIcon width={8} height={8} fill={'#F338C3'} stroke={'#F338C3'} />
          <span className="text-xs font-medium">Beginner</span>
        </div>
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold sm:mt-5 sm:font-medium sm:text-[42px] text-slate-50">
        {article?.attributes?.title}
      </h1>
      <h3 className="mt-3 text-sm text-center sm:mt-5 sm:text-lg text-slate-400">{article?.attributes?.description}</h3>
    </div>
  )
}
