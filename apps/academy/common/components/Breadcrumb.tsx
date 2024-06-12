import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/solid'
import { Container, IconButton, LinkInternal } from '@sushiswap/ui'
import { getShareText } from 'common/helpers'
import { GhostArticle } from 'lib/ghost'
import { FC } from 'react'

interface Breadcrumb {
  article?: GhostArticle
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
      <LinkInternal href="/" className="flex items-center gap-2 group">
        <ArrowLeftIcon
          width={12}
          className="text-slate-400 group-hover:text-slate-50"
        />
        <p className="text-sm font-medium cursor-pointer group-hover:text-slate-50 text-slate-400">
          Back
        </p>
      </LinkInternal>
      <IconButton icon={ShareIcon} name="Share" onClick={onShare} />
    </Container>
  )
}
