import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'
import { Image } from '../Image'

interface ArticleAuthors {
  article?: ArticleEntity
}

export const ArticleAuthors: FC<ArticleAuthors> = ({ article }) => {
  return (
    <div className="flex justify-center mt-4 sm:mt-8">
      <ul className="flex flex-wrap space-x-5 text-sm">
        {article?.attributes?.authors?.data.map((author, index) => (
          <li key={index} className="flex items-center whitespace-nowrap">
            <div className="relative w-6 h-6 overflow-hidden rounded-full bg-slate-800">
              {author?.attributes?.avatar.data && <Image image={author?.attributes.avatar.data} />}
            </div>
            <div className="ml-2">
              <span className="font-medium text-slate-50">{author?.attributes?.name}</span>
              {/* {author?.attributes?.handle && (
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
              )} */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
