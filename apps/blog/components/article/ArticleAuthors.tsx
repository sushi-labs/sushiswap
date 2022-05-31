import { FC } from 'react'

import { Article } from '../../types'
import { Image } from '../Image'

interface ArticleAuthors {
  article: Article
}

export const ArticleAuthors: FC<ArticleAuthors> = ({ article }) => {
  return (
    <div className="mt-6">
      <ul className="flex flex-wrap text-sm leading-6 -mt-6 -mx-5">
        {article.attributes.authors.data.map((author) => (
          <li key={author.id} className="flex items-center font-medium whitespace-nowrap px-5 mt-6">
            <div className="mr-3 w-9 h-9 rounded-full overflow-hidden bg-slate-800">
              <Image image={author.attributes.avatar} />
            </div>
            <div className="text-sm leading-4">
              <div className="font-medium text-slate-200">{author.attributes.name}</div>
              {author.attributes.handle && (
                <div className="mt-1">
                  <a
                    target="_blank"
                    className="text-sky-400 font-medium"
                    href={`https://twitter.com/${author.attributes.handle}`}
                    rel="noreferrer"
                  >
                    @{author.attributes.handle}
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
