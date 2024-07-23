'use client'

import { LinkIcon } from '@heroicons/react-v1/outline'
import type { BlogArticle } from '@sushiswap/graph-client/strapi'

interface ArticleLinks {
  article: BlogArticle
}

export function ArticleLinksClient({ article }: ArticleLinks) {
  return (
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
  )
}
