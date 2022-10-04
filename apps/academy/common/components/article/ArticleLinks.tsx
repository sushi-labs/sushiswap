import { EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Tooltip, TwitterIcon } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { ArticleEntity } from '../../../.mesh'

interface ArticleLinks {
  article?: ArticleEntity
}

export const ArticleLinks: FC<ArticleLinks> = ({ article }) => {
  const shareText = `Check out this Sushi article: ${article?.attributes.title}`
  const [showTooltip, setShowTooltip] = useState(false)
  const handleTooltipTimer = () => {
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 1000)
  }

  return (
    <section>
      <div className="flex gap-6">
        <a
          target="_blank"
          title="Share on Twitter"
          href={`http://twitter.com/share?text=${shareText}&url=https://sushi.com/academy/articles/${article?.attributes?.slug}`}
          rel="noreferrer"
        >
          <TwitterIcon width={20} height={20} className="cursor-pointer text-blue hover:text-blue-400" />
        </a>
        <a
          title="Share by Email"
          href={`mailto:?subject=${encodeURI(article?.attributes?.title || '')}&body=${shareText} ${encodeURI(
            `https://sushi.com/academy/articles/${article?.attributes?.slug}`
          )}`}
        >
          <EnvelopeIcon width={20} height={20} className="cursor-pointer text-blue hover:text-blue-400" />
        </a>
        <Tooltip
          button={
            <LinkIcon
              width={20}
              height={20}
              className="cursor-pointer text-blue hover:text-blue-400"
              onClick={() => {
                navigator.clipboard.writeText(`https://sushi.com/academy/articles/${article?.attributes?.slug}`)
                handleTooltipTimer()
              }}
            />
          }
          panel={<>Copied to clipboard</>}
          placement="bottom"
          visible={showTooltip}
        />
      </div>
    </section>
  )
}
