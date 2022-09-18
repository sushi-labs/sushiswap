import { Chip, Typography } from '@sushiswap/ui'
import { CircleLabyrinthIcon } from 'common/icons/CircleLabyrinthIcon'
import { format } from 'date-fns'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'

interface ArticleHeader {
  article?: ArticleEntity
}

export const ArticleHeader: FC<ArticleHeader> = ({ article }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-start gap-3 lg:gap-4">
        <div className="flex p-1 rounded-full bg-slate-200 items-center gap-2.5 pr-3">
          <Chip label="Furo" className="!bg-white text-black" />
          {article?.attributes?.publishedAt && (
            <Typography variant="xxs" className="text-black">
              <time dateTime={article.attributes.publishedAt}>
                {format(new Date(article.attributes.publishedAt), 'dd MMM yyyy')}
              </time>
            </Typography>
          )}
        </div>
        <div className="flex gap-1">
          <CircleLabyrinthIcon />
          <span className="text-xs font-medium">Beginner</span>
        </div>
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-center md:font-medium md:text-4xl text-slate-200">
        {article?.attributes?.title}
      </h1>
      <h3 className="mt-3 text-sm tracking-tight text-center md:mt-5 md:text-lg text-slate-500">
        {article?.attributes?.description}
      </h3>
    </div>
  )
}
