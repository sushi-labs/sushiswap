'use client'

import { EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline'
import type { AcademyArticle } from '@sushiswap/graph-client/strapi'
import { ClipboardController } from '@sushiswap/ui'
import { TwitterIcon } from '@sushiswap/ui/icons/TwitterIcon'
import type { FC } from 'react'
import { getShareText } from 'src/app/(cms)/constants'

interface ArticleLinks {
  article: AcademyArticle
}

export const ArticleLinks: FC<ArticleLinks> = ({ article }) => {
  const shareText = getShareText(article.title)
  const url = `https://www.sushi.com/academy/articles/${article.slug}`

  return (
    <section>
      <div className="flex gap-6">
        <a
          target="_blank"
          title="Share on Twitter"
          href={`http://twitter.com/share?text=${shareText}&url=https://www.sushi.com/academy/articles/${article.slug}`}
          rel="noreferrer"
        >
          <TwitterIcon
            width={20}
            height={20}
            className="cursor-pointer text-blue hover:text-blue-400"
          />
        </a>
        <a
          title="Share by Email"
          href={`mailto:?subject=${encodeURI(
            article.title,
          )}&body=${shareText} ${encodeURI(url)}`}
        >
          <EnvelopeIcon
            width={20}
            height={20}
            className="cursor-pointer text-blue hover:text-blue-400"
          />
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
