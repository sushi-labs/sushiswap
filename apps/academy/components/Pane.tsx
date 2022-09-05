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
}

export const Pane: FC<Pane> = ({ article, isBig }) => {
  const authors: AuthorEntity[] | undefined = article.attributes?.authors?.data
  const authorName: string | undefined = authors?.length > 1 ? 'Multiple Owners' : authors[0]?.attributes.name

  return (
    <div
      className={classNames(
        'w-full relative group',
        isBig ? 'h-[340px] sm:col-span-2 sm:flex gap-6' : 'h-[340px] sm:h-[480px]'
      )}
    >
      <div
        className={classNames(
          'relative rounded-xl overflow-hidden',
          isBig ? 'sm:w-[55%] sm:h-full h-[156px]' : 'sm:h-[210px] h-[156px]'
        )}
      >
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
      <div className={classNames('flex flex-col gap-3 sm:gap-5', isBig ? 'sm:w-[45%] mt-4 sm:mt-0' : 'mt-4 sm:mt-5')}>
        <div className="flex items-center justify-start gap-3 lg:gap-4">
          <div className="flex p-1 rounded-full bg-slate-200 items-center gap-1.5 pr-3">
            <Chip label="Furo" size="sm" />
            <span className="text-xs font-medium text-black sm:text-sm">5 min read</span>
          </div>
          <div className="flex gap-1">
            <CircleLabyrinthIcon />
            <span className="text-xs font-medium">Beginner</span>
          </div>
        </div>
        <div>
          <a href={`/academy/articles/${article?.attributes?.slug}`} className="cursor-pointer hover:underline">
            <span
              className={classNames(
                'text-slate-200 font-bold sm:font-medium',
                isBig
                  ? 'leading-8 lg:leading-10 text-base sm:text-2xl lg:text-3xl'
                  : 'leading-6 lg:leading-8 text-base sm:text-xl lg:text-2xl'
              )}
            >
              {article?.attributes?.title}
            </span>
          </a>
          <span
            className={classNames(
              'text-xs text-slate-400 line-clamp-4 sm:mt-5 sm:text-sm',
              isBig ? 'sm:line-clamp-4 line-clamp-2' : 'line-clamp-2'
            )}
          >
            {article?.attributes?.description}
          </span>
        </div>
        <div className="absolute bottom-0 flex items-center gap-4">
          {authors?.length > 0 && (
            <div className="flex -space-x-4 lg:-space-x-6">
              {authors.slice(0, 4).map((author, i, a) => (
                <div
                  key={author.id}
                  className="relative overflow-hidden rounded-full w-9 h-9 lg:h-12 lg:w-12 ring-2 ring-white"
                  style={{ zIndex: (a.length - i) * 10 }}
                >
                  <Image image={author?.attributes.avatar.data} width={64} height={64} />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            {authorName && <span className="text-xs font-medium sm:text-sm">{authorName}</span>}
            <Typography variant="xxs" className="text-slate-400 line-clamp-2">
              {article?.attributes?.publishedAt && format(new Date(article?.attributes.publishedAt), 'dd MMM, yyyy')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
