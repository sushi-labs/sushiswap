import { LinkIcon, MailIcon } from '@heroicons/react/outline'
import { TwitterIcon } from '@sushiswap/ui/icons/TwitterIcon'
import { Article } from 'lib/strapi/article'
import type { FC } from 'react'

interface ArticleLinks {
  article: Article
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
        <LinkIcon
          className="cursor-pointer text-blue hover:text-blue-400"
          height={20}
          onClick={() =>
            navigator.clipboard.writeText(
              `https://www.sushi.com/blog/${article.slug}`,
            )
          }
          width={20}
        />
      </div>
    </section>
  )
}
