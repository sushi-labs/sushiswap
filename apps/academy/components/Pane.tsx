import { Chip, classNames, Typography } from '@sushiswap/ui'
import { CircleLabyrinthIcon } from 'components/icons/CircleLabyrinthIcon'
import { format } from 'date-fns'
import { FC } from 'react'

import { ArticleEntity, AuthorEntity } from '../.mesh'
import { isMediaVideo } from '../lib/media'
import { Image } from './Image'

interface Pane {
  article: ArticleEntity
  isBig?: boolean
  className?: string
}

export const Pane: FC<Pane> = ({ article, isBig, className }) => {
  const authors: AuthorEntity[] | undefined = article.attributes?.authors?.data
  const authorName: string | undefined = authors?.length > 1 ? 'Multiple Owners' : authors[0]?.attributes.name

  return (
    <div
      className={classNames(
        className,
        'w-full relative group',
        isBig ? 'h-[340px] col-span-2 sm:!flex gap-6' : 'h-[480px]'
      )}
    >
      <div className={classNames('relative rounded-xl overflow-hidden', isBig ? 'w-[55%] h-full' : 'h-[210px]')}>
        {article?.attributes?.cover?.data && (
          <a href={`/academy/articles/${article?.attributes?.slug}`} className="cursor-pointer hover:underline">
            <Image
              height={isBig ? 340 : 240}
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
      <div className={classNames('flex flex-col gap-5', isBig ? 'w-[45%]' : 'mt-5')}>
        <div className="flex items-center justify-between gap-1 lg:gap-4 lg:justify-start">
          <div className="flex p-1 rounded-full bg-slate-200 items-center gap-1.5 pr-3">
            <Chip label="Furo" />
            <Typography variant="sm" className="text-black" weight={500}>
              5 min read
            </Typography>
          </div>
          <div className="flex gap-1">
            <CircleLabyrinthIcon />
            <Typography variant="xs" weight={500}>
              Beginner
            </Typography>
          </div>
        </div>
        <a href={`/academy/articles/${article?.attributes?.slug}`} className="cursor-pointer hover:underline">
          <span
            className={classNames(
              'text-slate-200 font-medium',
              isBig ? 'leading-8 lg:leading-10 text-2xl lg:text-3xl' : 'leading-6 lg:leading-8 text-xl lg:text-2xl'
            )}
          >
            {article?.attributes?.title}
          </span>
        </a>
        <Typography variant="sm" className="leading-6 text-slate-400 line-clamp-4">
          {article?.attributes?.description}
        </Typography>
        <div className="absolute bottom-0 flex items-center gap-4">
          {authors?.length > 0 && (
            <div className="flex -space-x-6">
              {authors.slice(0, 4).map((author, i, a) => (
                <div
                  key={author.id}
                  className="relative w-8 h-8 overflow-hidden rounded-full lg:h-12 lg:w-12 ring-2 ring-white"
                  style={{ zIndex: (a.length - i) * 10 }}
                >
                  <Image image={author?.attributes.avatar.data} width={64} height={64} />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            {authorName && (
              <Typography variant="sm" weight={500}>
                {authorName}
              </Typography>
            )}
            <Typography variant="xxs" className="text-slate-400 line-clamp-2">
              {article?.attributes?.publishedAt && format(new Date(article?.attributes.publishedAt), 'dd MMM, yyyy')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
