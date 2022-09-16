import { ChevronLeftIcon, ShareIcon } from '@heroicons/react/solid'
import { Container, IconButton, Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

export const Breadcrumb: FC = () => {
  const openShare = () => {
    console.log('navigator', navigator)
    if (navigator.share) {
      navigator
        .share({
          title: 'WebShare API Demo',
          url: 'https://codepen.io/ayoisaiah/pen/YbNazJ',
        })
        .then(() => {
          console.log('Thanks for sharing!')
        })
        .catch(console.error)
    }
  }
  return (
    <Container
      maxWidth="6xl"
      className="px-4 mx-auto md:mt-6 sticky md:relative top-[54px] bg-slate-900 z-30 h-10 flex justify-between items-center md:top-0"
    >
      <Link href="/articles" passHref>
        <a className="flex items-center gap-2 group">
          <ChevronLeftIcon width={20} className="text-slate-400 group-hover:text-slate-50" />
          <Typography variant="sm" weight={500} className="cursor-pointer group-hover:text-slate-50 text-slate-400">
            Back
          </Typography>
        </a>
      </Link>
      <IconButton className="w-5 h-5 md:hidden" onClick={openShare}>
        <ShareIcon className="text-slate-400" />
      </IconButton>
    </Container>
  )
}
