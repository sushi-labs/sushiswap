import { EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline'
import { TwitterIcon } from '@sushiswap/ui'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'

interface ArticleLinks {
  article?: ArticleEntity
}

export const ArticleLinks: FC<ArticleLinks> = ({ article }) => {
  return (
    <section>
      {/* <hr className="my-12 border border-slate-200/5" /> */}
      {/* <h2 className="mb-6 text-base font-semibold text-slate-200">Share article</h2> */}
      <div className="flex gap-6">
        <a
          target="_blank"
          title="Share on Twitter"
          href={`http://twitter.com/share?url=https://sushi.com/academy/articles/${article?.attributes?.slug}`}
          rel="noreferrer"
        >
          <TwitterIcon width={20} height={20} className="cursor-pointer text-blue hover:text-blue-400" />
        </a>
        <a
          title="Share by Email"
          href={`mailto:?subject=${encodeURI(
            article?.attributes?.title || ''
          )}&body=Checkout this new SushiSwap Blog article ${encodeURI(
            `https://sushi.com/academy/articles/${article?.attributes?.slug}`
          )}`}
        >
          <EnvelopeIcon width={20} height={20} className="cursor-pointer text-blue hover:text-blue-400" />
        </a>
        <LinkIcon
          width={20}
          height={20}
          className="cursor-pointer text-blue hover:text-blue-400"
          onClick={() =>
            navigator.clipboard.writeText(`https://sushi.com/academy/articles/${article?.attributes?.slug}`)
          }
        />
      </div>
    </section>
  )
}
