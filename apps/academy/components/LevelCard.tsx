import { Chip, Typography } from '@sushiswap/ui'
import NextImage from 'next/image'
import { FC } from 'react'

interface LevelCard {
  imgSrc: string
  chipLabel: string
  title: string
  name: string
}

export const LevelCard: FC<LevelCard> = ({ imgSrc, chipLabel, title, name }) => {
  return (
    <a
      href={`/academy/articles?level=${name}`}
      className="cursor-pointer h-[472px] min-w-[310px] flex-1 md:h-[537px] py-12 px-8 bg-slate-500 rounded-3xl flex flex-col justify-between"
    >
      {/* <NextImage width={200} height={150} src={imgSrc} /> */}
      <div className="h[150px]" /> {/** TODO: change */}
      <div className="space-y-5">
        <Chip label={chipLabel} color="default" />
        <Typography variant="h3" weight={700} className="h-16">
          {title}
        </Typography>
      </div>
    </a>
  )
}
