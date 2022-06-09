import { LinkIcon, MailIcon } from '@heroicons/react/outline'
import { TwitterIcon } from '@sushiswap/ui'
import { FC } from 'react'

import { Article } from '../../types'

interface ArticleLinks {
  article: Article
}

export const ArticleLinks: FC<ArticleLinks> = ({ article }) => {
  return (
    <section>
      <hr className="border border-slate-200/5 my-12" />
      <h2 className="text-base mb-6 font-semibold text-slate-200">Share article</h2>
      <div className="flex gap-5">
        <a
          target="_blank"
          title="Share on Twitter"
          href={`http://twitter.com/share?url=${window.location.href}/blog/${article.attributes.slug}`}
          rel="noreferrer"
        >
          <TwitterIcon width={20} height={20} className="text-blue hover:text-blue-400 cursor-pointer" />
        </a>
        <a
          title="Share by Email"
          href={`mailto:?subject=${encodeURI(
            article.attributes.title
          )}&body=Checkout this new SushiSwap Blog article ${encodeURI(
            `${window.location.href}/blog/${article.attributes.slug}`
          )}`}
        >
          <MailIcon width={20} height={20} className="text-blue hover:text-blue-400 cursor-pointer" />
        </a>
        <LinkIcon
          width={20}
          height={20}
          className="text-blue hover:text-blue-400 cursor-pointer"
          onClick={() => navigator.clipboard.writeText(`${window.location.href}/blog/${article.attributes.slug}`)}
        />
      </div>
    </section>
  )
}
