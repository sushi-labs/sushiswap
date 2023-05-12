import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/solid'
import { Container, IconButton, Typography } from '@sushiswap/ui'
import { getShareText } from 'common/helpers'
import Link from 'next/link'
import { FC } from 'react'

import { ArticleEntity } from '.mesh'

interface Breadcrumb {
  article?: ArticleEntity
}

export const Breadcrumb: FC<Breadcrumb> = ({ article }) => {
  const shareText = getShareText(article?.attributes?.title as string)
  const url = `https://www.sushi.com/academy/articles/${article?.attributes?.slug}`
  const onShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shareText,
        text: shareText,
        url,
      })
    }
  }
  return (
    <Container
      maxWidth="6xl"
      className="px-4 mx-auto sm:mt-6 sticky sm:relative top-[54px] bg-slate-900 z-30 h-10 flex justify-between items-center sm:top-0"
    >
      <Link href="/articles" passHref legacyBehavior>
        <a className="flex items-center gap-2 group">
          <ArrowLeftIcon width={12} className="text-slate-400 group-hover:text-slate-50" />
          <Typography variant="sm" weight={500} className="cursor-pointer group-hover:text-slate-50 text-slate-400">
            Back
          </Typography>
        </a>
      </Link>
      <IconButton className="w-5 h-5 sm:hidden" onClick={onShare}>
        <ShareIcon className="text-slate-50" />
      </IconButton>
    </Container>
  )
}
