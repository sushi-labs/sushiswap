import type { AcademyArticle } from '@sushiswap/graph-client/strapi'
import { Chip, classNames } from '@sushiswap/ui'
import format from 'date-fns/format'
import Link from 'next/link'
import { Media } from 'src/app/(cms)/components/media'
import { isMediaVideo } from 'src/app/(cms)/lib/media'
import { DifficultyLabel } from '../difficulty-label'

interface ArticleCard {
  article: AcademyArticle
}

export function ArticleCard({ article }: ArticleCard) {
  const product = article.products[0]

  return (
    <Link href={`/academy/${article.slug}`} className="">
      <div
        className={classNames(
          'relative h-[436px] sm:h-[446px] rounded-lg bg-slate-800/50 sm:bg-[#182030] overflow-hidden sm:z-10',
          'sm:ease-in-out sm:duration-300 sm:hover:scale-105 sm:hover:shadow-[4px_4px_27px_rgba(0,0,0,0.25)_0px_24px_24px_-16px_rgba(15,15,15,0.2)] sm:hover:z-20',
        )}
      >
        <div className="h-[192px] sm:h-[202px] relative">
          {article.cover ? (
            <Media
              className={classNames(
                isMediaVideo(article.cover.provider_metadata)
                  ? ''
                  : 'group-hover:scale-[1.06] scale-[1.01] transition [animation-duration:400ms]',
              )}
              image={article.cover}
              quality={100}
            />
          ) : null}
        </div>

        <div className="grid gap-4 p-6">
          <div className="flex items-center w-full gap-5">
            {product && <Chip variant="ghost">{product.name}</Chip>}
            <DifficultyLabel isCard article={article} />
          </div>

          <p className="text-lg font-semibold  leading-5 text-slate-50 line-clamp-2">
            {article.title}
          </p>

          <p
            className={classNames(
              'text-sm leading-5 text-slate-400 line-clamp-3',
            )}
          >
            {article.description}
          </p>

          <p className="text-xs font-medium absolute text-slate-500 bottom-6 left-6">
            {article.publishedAt &&
              format(new Date(article.publishedAt), 'dd MMM, yyyy')}
          </p>
        </div>
      </div>
    </Link>
  )
}
