import type { BlogArticle } from '@sushiswap/graph-client/strapi'
import type { FC } from 'react'
import { Media } from '../../components/media'

interface ArticleAuthors {
  article: BlogArticle
}

export const ArticleAuthors: FC<ArticleAuthors> = ({ article }) => {
  return (
    <div className="mt-6">
      <ul className="flex flex-wrap -mx-5 -mt-6 text-sm leading-6">
        {article.authors.map((author) => (
          <li
            className="flex items-center px-5 mt-6 font-medium whitespace-nowrap"
            key={author.email}
          >
            <div className="relative mr-3 overflow-hidden rounded-full w-9 h-9 bg-slate-800">
              {author.avatar ? (
                <Media height={64} image={author.avatar} width={64} />
              ) : null}
            </div>
            <div className="text-sm leading-4">
              <div className="font-medium text-slate-200">{author.name}</div>
              {author.handle ? (
                <div className="mt-1">
                  <a
                    className="font-medium text-sky-400"
                    href={`https://twitter.com/${author.handle}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    @{author.handle}
                  </a>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
