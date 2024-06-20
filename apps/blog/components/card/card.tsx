import { ChevronRightIcon } from '@heroicons/react/solid'
import { Chip, LinkInternal, classNames } from '@sushiswap/ui'
import format from 'date-fns/format'
import { Article } from 'lib/strapi/article'
import type { FC } from 'react'
import { isMediaVideo } from '../../lib/media'
import { Image } from '../Image'

interface Card {
  article: Article
}

export const Card: FC<Card> = ({ article }) => {
  return (
    <LinkInternal className="group" href={`/${article.slug}`}>
      <div className="transition duration-[400ms] relative h-[400px] cursor-pointer w-full rounded-xl shadow-md bg-slate-800 overflow-hidden hover:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
        <div className="relative h-[240px]">
          {article.cover ? (
            <Image
              className={classNames(
                isMediaVideo(article.cover.provider_metadata)
                  ? ''
                  : 'group-hover:scale-[1.06] scale-[1.01] transition duration-[400ms]',
              )}
              height={240}
              image={article.cover}
              quality={100}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-3 px-4">
          {article.categories.length > 0 && (
            <div className="flex gap-1 pt-3">
              {article.categories.map((category) => (
                <Chip key={category.id} variant="ghost">
                  {category.name}
                </Chip>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-200 line-clamp-1">
              {article.title}
            </p>
            <p className="text-sm text-slate-400 line-clamp-2">
              {article.description}
            </p>
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400 line-clamp-2">
                  {article.publishedAt
                    ? format(new Date(article.publishedAt), 'dd MMM, yyyy')
                    : null}
                </p>
                <div className="flex items-center text-sm font-medium text-blue">
                  Read more <ChevronRightIcon height={16} width={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LinkInternal>
  )
}
