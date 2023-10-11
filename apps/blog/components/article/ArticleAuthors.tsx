import { GhostArticle } from 'lib/ghost'
import { FC } from 'react'

import { Image } from '../Image'

interface ArticleAuthors {
  article?: GhostArticle
}

export const ArticleAuthors: FC<ArticleAuthors> = ({ article }) => {
  return (
    <div className="mt-6">
      <ul className="flex flex-wrap -mx-5 -mt-6 text-sm leading-6">
        {article?.attributes?.authors?.data.map((author) => (
          <li
            key={author.attributes?.email}
            className="flex items-center px-5 mt-6 font-medium whitespace-nowrap"
          >
            <div className="relative mr-3 overflow-hidden rounded-full w-9 h-9 bg-slate-800">
              {author.attributes.avatar.data && (
                // eslint-disable-next-line
                <Image
                  image={author.attributes.avatar.data}
                  width={64}
                  height={64}
                />
              )}
            </div>
            <div className="text-sm leading-4">
              <div className="font-medium text-slate-200">
                {author?.attributes?.name}
              </div>
              {author?.attributes?.handle && (
                <div className="mt-1">
                  <a
                    target="_blank"
                    className="font-medium text-sky-400"
                    href={`https://twitter.com/${author?.attributes.handle}`}
                    rel="noreferrer"
                  >
                    @{author?.attributes.handle}
                  </a>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
