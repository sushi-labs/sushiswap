import { EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline'
import { getShareText } from 'common/helpers'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'
import { ClipboardController } from '@sushiswap/ui/components/ClipboardController'
import { TwitterIcon } from '@sushiswap/ui/components/icons'

interface ArticleLinks {
  article?: ArticleEntity
}

export const ArticleLinks: FC<ArticleLinks> = ({ article }) => {
  const shareText = getShareText(article?.attributes?.title)
  const url = `https://www.sushi.com/academy/articles/${article?.attributes?.slug}`

  return (
    <section>
      <div className="flex gap-6">
        <a
          target="_blank"
          title="Share on Twitter"
          href={`http://twitter.com/share?text=${shareText}&url=https://www.sushi.com/academy/articles/${article?.attributes?.slug}`}
          rel="noreferrer"
        >
          <TwitterIcon width={20} height={20} className="cursor-pointer text-blue hover:text-blue-400" />
        </a>
        <a
          title="Share by Email"
          href={`mailto:?subject=${encodeURI(article?.attributes?.title || '')}&body=${shareText} ${encodeURI(url)}`}
        >
          <EnvelopeIcon width={20} height={20} className="cursor-pointer text-blue hover:text-blue-400" />
        </a>
        <ClipboardController>
          {({ setCopied }) => (
            <LinkIcon
              width={20}
              height={20}
              className="cursor-pointer text-blue hover:text-blue-400"
              onClick={() => setCopied(url)}
            />
          )}
        </ClipboardController>
      </div>
    </section>
  )
}
