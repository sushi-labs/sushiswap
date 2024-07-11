import { MailIcon } from '@heroicons/react-v1/outline'
import type { BlogArticle } from '@sushiswap/graph-client/strapi'
import { TwitterIcon } from '@sushiswap/ui/icons/TwitterIcon'
import type { FC } from 'react'
import { ArticleLinksClient } from './article-links-client'

interface ArticleLinks {
  article: BlogArticle
}

export const ArticleLinks: FC<ArticleLinks> = ({ article }) => {
  return (
    <section>
      <hr className="my-12 border border-slate-200/5" />
      <h2 className="mb-6 text-base font-semibold text-slate-200">
        Share article
      </h2>
      <div className="flex gap-5">
        <a
          href={`http://twitter.com/share?url=https://www.sushi.com/blog/${article.slug}`}
          rel="noreferrer"
          target="_blank"
          title="Share on Twitter"
        >
          <TwitterIcon
            className="cursor-pointer text-blue hover:text-blue-400"
            height={20}
            width={20}
          />
        </a>
        <a
          href={`mailto:?subject=${encodeURI(
            article.title || '',
          )}&body=Checkout this new SushiSwap Blog article ${encodeURI(
            `https://www.sushi.com/blog/${article.slug}`,
          )}`}
          title="Share by Email"
        >
          <MailIcon
            className="cursor-pointer text-blue hover:text-blue-400"
            height={20}
            width={20}
          />
        </a>
        <ArticleLinksClient article={article} />
      </div>
    </section>
  )
}
