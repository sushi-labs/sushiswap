import { Chip, classNames, Typography } from '@sushiswap/ui'
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
    <a href={`/academy/articles/${article.attributes?.slug}`}>
      <div className="relative h-[436px] sm:h-[446px] rounded-lg bg-slate-800/50 sm:bg-[#182030] overflow-hidden sm:ease-in-out sm:duration-300 sm:hover:scale-105 sm:hover:shadow-[4px_4px_27px_rgba(0,0,0,0.25)_0px_24px_24px_-16px_rgba(15,15,15,0.2)] sm:z-10 sm:hover:z-20">
        <div className="relative h-[192px] sm:h-[202px]">
          {article.attributes?.cover?.data && <Image quality={100} image={article.attributes.cover.data} />}
        </div>

        <div className="grid gap-4 p-6">
          <div className="flex items-center w-full gap-5">
            {product && <Chip className="pl-2.5 pr-2.5 h-7" label={product.name} />}
            <DifficultyLabel isCard article={article} />
          </div>

          <Typography variant="lg" weight={600} className="leading-5 text-slate-50 line-clamp-2">
            {article.attributes?.title}
          </Typography>

          <Typography variant="sm" className={classNames('leading-5 text-slate-400 line-clamp-3')}>
            {article.attributes?.description}
          </Typography>

          <Typography variant="xs" weight={500} className="absolute text-slate-500 bottom-6 left-6">
            {article.attributes?.publishedAt && format(new Date(article.attributes.publishedAt), 'dd MMM, yyyy')}
          </Typography>
        </div>
      </div>
    </a>
  )
}
