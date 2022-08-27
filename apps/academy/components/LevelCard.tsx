import { Chip, Typography } from '@sushiswap/ui'
import NextImage from 'next/image'
import { FC } from 'react'

interface LevelCard {
  imgSrc: string
  chipLabel: string
  title: string
}

export const LevelCard: FC<LevelCard> = ({ imgSrc, chipLabel, title }) => {
  return (
    <div className="h-[472px] min-w-[310px] md:w-[378px] md:h-[537px] py-12 px-8 bg-slate-500 rounded-3xl flex flex-col justify-between">
      <NextImage width={200} height={150} src={imgSrc} />

      <div className="space-y-5">
        <Chip label={chipLabel} color="default" />
        <Typography variant="h3" weight={700} className="h-16">
          {title}
        </Typography>
      </div>
    </div>
  )
}
