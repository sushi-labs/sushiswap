import { ChevronRightIcon } from '@heroicons/react/solid'
import { classNames, LinkInternal } from '@sushiswap/ui'
import { Chip } from '@sushiswap/ui/components/chip'
import { format } from 'date-fns'
import { FC } from 'react'
import { Article } from 'types'

import { isMediaVideo } from '../../lib/media'
import { Image } from '../Image'

interface Card {
  article: Article
}

export const Card: FC<Card> = ({ article }) => {
  return (
    <LinkInternal href={`/blog/${article?.attributes?.slug}`} className="group">
      <div className="transition duration-[400ms] relative h-[400px] cursor-pointer w-full rounded-xl shadow-md bg-slate-800 overflow-hidden hover:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
        <div className="relative h-[240px]">
          {article?.attributes?.cover?.data && (
            <Image
              height={240}
              quality={100}
              image={article?.attributes.cover.data}
              className={classNames(
                isMediaVideo(article?.attributes.cover.data?.attributes?.provider_metadata)
                  ? ''
                  : 'group-hover:scale-[1.06] scale-[1.01] transition duration-[400ms]'
              )}
            />
          )}
        </div>
        <div className="flex flex-col gap-3 px-4">
          {(article?.attributes?.categories?.data || []).length > 0 && (
            <div className="flex gap-1 pt-3">
              {article?.attributes?.categories?.data.map((category) => (
                <Chip variant="ghost" key={category.id}>
                  {category?.attributes?.name}
                </Chip>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-200 line-clamp-1">{article?.attributes?.title}</p>
            <p className="text-sm text-slate-400 line-clamp-2">{article?.attributes?.description}</p>
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400 line-clamp-2">
                  {article?.attributes?.publishedAt &&
                    format(new Date(article?.attributes.publishedAt), 'dd MMM, yyyy')}
                </p>
                <div className="flex items-center text-sm font-medium text-blue">
                  Read more <ChevronRightIcon width={16} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LinkInternal>
  )
}
