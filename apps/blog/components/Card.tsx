import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { Article } from '../types'
import { Image } from './Image'

interface Card {
  article: Article
}

export const Card: FC<Card> = ({ article }) => {
  return (
    <div className="h-[480px] cursor-pointer w-full rounded-xl shadow-md bg-slate-800 overflow-hidden hover:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
      <div className="relative h-[300px]">
        <Image image={article.attributes.cover} />
      </div>
      <div className="flex flex-col gap-2  p-6">
        <Typography weight={700} className="text-slate-200">
          {article.attributes.category.data.attributes.name}
        </Typography>
        <Typography className="text-slate-400">{article.attributes.title}</Typography>
      </div>
    </div>
  )
}
