import { ClockIcon } from '@heroicons/react/outline'
import { CircleIcon, classNames, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { FC } from 'react'

import { ArticleEntity } from '../../.mesh'
import { isMediaVideo } from '../../lib/media'
import { Image } from '../Image'

interface Card {
  article: ArticleEntity
  isBig?: boolean
}

export const Card: FC<Card> = ({ article, isBig }) => {
  console.log('article', article)
  const level = 'Advanced' // TODO: connect

  return (
    <div
      className={classNames(
        'h-[420px] w-full rounded-xl bg-slate-800 overflow-hidden ring-1 ring-slate-700',
        isBig && 'col-span-2 flex flex-row gap-6'
      )}
    >
      <div className={classNames('relative', isBig ? 'h-full w-[55%]' : 'h-[205px]')}>
        {article?.attributes?.cover?.data && (
          <a href={`/academy/articles/${article?.attributes?.slug}`} className="cursor-pointer hover:underline">
            <Image
              height={340}
              quality={100}
              image={article?.attributes.cover.data}
              className={classNames(
                isMediaVideo(article?.attributes.cover.data?.attributes?.provider_metadata)
                  ? ''
                  : 'group-hover:scale-[1.06] scale-[1.01] transition duration-[400ms] rounded-xl'
              )}
            />
          </a>
        )}
      </div>

      <div className={classNames('flex flex-col gap-3', isBig ? 'w-[45%] py-14 justify-between' : 'p-6')}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-slate-400">
            <Typography variant="sm">
              {article?.attributes?.publishedAt && format(new Date(article?.attributes.publishedAt), 'dd MMM, yyyy')}
            </Typography>
            <div className="flex gap-2">
              <ClockIcon width={16} />
              <Typography variant="sm">5 min read</Typography>
            </div>
          </div>
          <a href={`/academy/articles/${article?.attributes?.slug}`} className="cursor-pointer hover:underline">
            <Typography variant="h2" weight={700} className="leading-10 text-slate-200">
              {article?.attributes?.title}
            </Typography>
          </a>

          <Typography variant="sm" className="leading-6 text-slate-400 line-clamp-4">
            {article?.attributes?.description}
          </Typography>
        </div>
        {isBig && (
          <div className="flex items-center gap-2">
            <CircleIcon width={8} className="fill-white" />
            <Typography variant="lg" weight={700}>
              {level}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}
