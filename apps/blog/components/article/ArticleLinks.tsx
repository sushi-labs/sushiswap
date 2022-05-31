import { LinkIcon, MailIcon } from '@heroicons/react/outline'
import { TwitterIcon } from '@sushiswap/ui'
import { FC } from 'react'

import { getStrapiURL } from '../../lib/api'
import { Article } from '../../types'

interface ArticleLinks {
  article: Article
}

export const ArticleLinks: FC<ArticleLinks> = ({ article }) => {
  console.log(article)
  return (
    <>
      <h3 className="text-slate-200 font-bold text-lg mb-4 mt-12 group flex whitespace-pre-wrap">Share article</h3>
      <div className="flex gap-5">
        <a
          target="_blank"
          title="Share on Twitter"
          href={`http://twitter.com/share?url=${getStrapiURL(`/blog/${article.attributes.slug}`)}`}
          rel="noreferrer"
        >
          <TwitterIcon width={20} height={20} className="hover:text-blue text-slate-200 cursor-pointer" />
        </a>
        <a
          title="Share by Email"
          href={`mailto:?subject=${encodeURI(
            article.attributes.title
          )}&body=Checkout this new SushiSwap Blog article ${encodeURI(
            getStrapiURL(`/blog/${article.attributes.slug}`)
          )}`}
        >
          <MailIcon width={20} height={20} className="hover:text-blue text-slate-200 cursor-pointer" />
        </a>
        <LinkIcon
          width={20}
          height={20}
          className="hover:text-blue text-slate-200 cursor-pointer"
          onClick={() => navigator.clipboard.writeText(getStrapiURL(`/blog/${article.attributes.slug}`))}
        />
      </div>
    </>
  )
}
