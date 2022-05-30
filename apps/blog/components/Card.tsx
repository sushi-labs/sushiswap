import { Typography } from '@sushiswap/ui'
import Image from 'next/image'
import { FC, ReactNode } from 'react'

interface Card {
  title: ReactNode | Array<ReactNode>
  subtitle: ReactNode | Array<ReactNode>
  href: string
}

export const Card: FC<Card> = ({ title, subtitle, href }) => {
  return (
    <div className="h-[480px] w-full rounded-2xl shadow-md bg-slate-800 overflow-hidden">
      <div className="relative h-[300px]">
        <Image src="/blog/image4.jpg" layout="fill" />
      </div>
      <div className="flex flex-col gap-2  p-6">
        <Typography weight={700} className="text-slate-200">
          {title}
        </Typography>
        <Typography className="text-slate-400">{subtitle}</Typography>
      </div>
    </div>
  )
}
