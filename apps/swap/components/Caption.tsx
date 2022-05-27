import { classNames, SushiIcon } from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

interface Caption {
  className?: string
}

export const Caption: FC<Caption> = ({ className }) => {
  return (
    <div
      className={classNames(
        className,
        'flex items-center justify-center gap-2 cursor-pointer pointer-events-auto text-slate-400 group'
      )}
    >
      <SushiIcon width={12} height={12} className="group-hover:text-slate-300 group-hover:animate-heartbeat" />{' '}
      <Link href="https://app.sushi.com" passHref={true}>
        <a className="py-1 text-xs select-none text-slate-500 group-hover:text-slate-300">
          Powered by <span className="font-bold">Sushi</span>
        </a>
      </Link>
    </div>
  )
}
