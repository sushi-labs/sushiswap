import { ClockIcon } from '@heroicons/react/outline'
import { CircleIcon, classNames, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'
import { isMediaVideo } from '../../../lib/media'
import { Image } from '../Image'

interface Card {
  article: ArticleEntity
  isBig?: boolean
}

export const Card: FC<Card> = ({ article, isBig }) => {
  const level = 'Advanced' // TODO: connect

  return (
    <div
      className={classNames(
        'h-[365px] sm:h-[420px] w-full rounded-xl bg-slate-800 group ring-1 ring-slate-700',
        isBig && 'sm:col-span-2 sm:flex flex-row gap-6'
      )}
    >
      <div
        className={classNames(
          'relative rounded-xl overflow-hidden',
          isBig ? 'h-[150px] sm:h-full sm:w-[55%]' : 'h-[150px] sm:h-[205px]'
        )}
      >
        {article?.attributes?.cover?.data && (
          <a href={`/academy/articles/${article?.attributes?.slug}`} className="cursor-pointer hover:underline">
            <Image
              height={isBig ? 500 : 300}
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

      <div className={classNames('flex flex-col gap-3', isBig ? 'sm:w-[45%] sm:py-14 justify-between p-6' : 'p-6')}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-slate-400">
            <Typography variant="sm">
              {article?.attributes?.publishedAt && format(new Date(article?.attributes.publishedAt), 'dd MMM, yyyy')}
            </Typography>
            <div className="flex gap-2">
              <ClockIcon width={16} />
              <Typography variant="sm">15 min</Typography>
            </div>
          </div>
          <a href={`/academy/articles/${article?.attributes?.slug}`} className="cursor-pointer hover:underline">
            <span
              className={classNames(
                'text-slate-200 font-bold',
                isBig
                  ? 'sm:leading-8 lg:leading-10 sm:text-2xl lg:text-3xl leading-6 text-xl line-clamp-2'
                  : 'leading-6 lg:leading-8 text-xl lg:text-2xl line-clamp-2'
              )}
            >
              {article?.attributes?.title}
            </span>
          </a>

          <Typography
            variant="sm"
            className={classNames('leading-6 text-slate-400', isBig ? 'sm:line-clamp-4 line-clamp-2' : 'line-clamp-2')}
          >
            {article?.attributes?.description}
          </Typography>
        </div>
        {isBig && (
          <div className="items-center hidden gap-2 sm:flex">
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
