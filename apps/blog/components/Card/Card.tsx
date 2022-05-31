import { ChevronRightIcon } from '@heroicons/react/solid'
import { Chip, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { FC } from 'react'

import { Article } from '../../types'
import { Image } from '../Image'

interface Card {
  article: Article
}

export const Card: FC<Card> = ({ article }) => {
  return (
    <a href={`/blog/${article.attributes.slug}`} className="group">
      <div className="transition duration-[400ms] relative h-[400px] cursor-pointer w-full rounded-xl shadow-md bg-slate-800 overflow-hidden hover:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
        <div className="relative h-[240px]">
          <Image
            quality={5}
            image={article.attributes.cover}
            className="group-hover:scale-105 transition duration-[400ms]"
          />
        </div>
        <div className="flex flex-col gap-3 px-4">
          {article.attributes.categories.data.length > 0 && (
            <div className="flex gap-1 pt-3">
              {article.attributes.categories.data.map((category) => (
                <Chip key={category.id} label={category.attributes.name} className="capitalize" />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <Typography variant="sm" weight={700} className="text-slate-200 line-clamp-1">
              {article.attributes.title}
            </Typography>
            <Typography variant="sm" className="text-slate-400 line-clamp-2">
              {article.attributes.description}
            </Typography>
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex justify-between items-center">
                <Typography variant="xs" weight={700} className="text-slate-400 line-clamp-2">
                  {format(new Date(article.attributes.publishedAt), 'dd MMM, yyyy')}
                </Typography>
                <div className="flex items-center text-sm font-bold text-blue">
                  Read more <ChevronRightIcon width={16} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}
