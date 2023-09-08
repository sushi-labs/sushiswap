import { classNames, LinkInternal } from '@sushiswap/ui'
import { Chip } from '@sushiswap/ui/components/chip'
import { format } from 'date-fns'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'
import { DifficultyLabel, Image } from '../'

interface Card {
  article: ArticleEntity
}

export const Card: FC<Card> = ({ article }) => {
  const product = article.attributes?.products?.data?.[0]?.attributes

  return (
    <LinkInternal href={`/articles/${article.attributes?.slug}`}>
      <div className="relative h-[436px] sm:h-[446px] rounded-lg bg-slate-800/50 sm:bg-[#182030] overflow-hidden sm:ease-in-out sm:duration-300 sm:hover:scale-105 sm:hover:shadow-[4px_4px_27px_rgba(0,0,0,0.25)_0px_24px_24px_-16px_rgba(15,15,15,0.2)] sm:z-10 sm:hover:z-20">
        <div className="relative h-[192px] sm:h-[202px]">
          {article.attributes?.cover?.data && <Image quality={100} image={article.attributes.cover.data} />}
        </div>

        <div className="grid gap-4 p-6">
          <div className="flex items-center w-full gap-5">
            {product && <Chip variant="ghost">{product.name}</Chip>}
            <DifficultyLabel isCard article={article} />
          </div>

          <p className="text-lg font-semibold  leading-5 text-slate-50 line-clamp-2">{article.attributes?.title}</p>

          <p className={classNames('text-sm leading-5 text-slate-400 line-clamp-3')}>
            {article.attributes?.description}
          </p>

          <p className="text-xs font-medium absolute text-slate-500 bottom-6 left-6">
            {article.attributes?.publishedAt && format(new Date(article.attributes.publishedAt), 'dd MMM, yyyy')}
          </p>
        </div>
      </div>
    </LinkInternal>
  )
}
