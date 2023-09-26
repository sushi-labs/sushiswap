import { Chip } from '@sushiswap/ui/components/chip'
import { format } from 'date-fns'
import { FC } from 'react'
import { Article } from 'types'

import { Image } from './Image'

interface ArticleListItem {
  article: Article
}

export const ArticleListItem: FC<ArticleListItem> = ({ article }) => {
  return (
    <a
      href={`/blog/${article?.attributes?.slug}`}
      className="grid grid-cols-[200px_auto] md:grid-cols-[300px_auto] py-8 gap-x-8 cursor-pointer border-slate-200/5"
    >
      {article?.attributes?.cover.data && (
        <div className="relative rounded-2xl overflow-hidden h-[120px] md:h-[160px]">
          {/* eslint-disable-next-line */}
          <Image
            quality={5}
            image={article?.attributes.cover.data}
            className="group-hover:scale-105 transition duration-[400ms]"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 md:gap-3">
        {(article?.attributes?.categories?.data || []).length > 0 && (
          <div className="flex gap-1 md:pt-3">
            {article?.attributes?.categories?.data.map((category) => (
              <Chip variant="ghost" key={category.id}>
                {category?.attributes?.name}
              </Chip>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 lg:gap-3">
          <div className="text-base font-medium md:text-2xl text-slate-200">{article?.attributes?.title}</div>
          {/*<p className="text-slate-400 line-clamp-2">{article?.attributes.description}</p>*/}
          <p className="text-sm font-medium text-slate-400">
            {article?.attributes?.publishedAt && format(new Date(article?.attributes.publishedAt), 'dd MMM, yyyy')}
          </p>
        </div>
      </div>
    </a>
  )
}
