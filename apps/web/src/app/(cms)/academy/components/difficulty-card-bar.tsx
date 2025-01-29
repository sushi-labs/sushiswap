import { ArrowRightIcon } from '@heroicons/react/24/outline'

import { Chip } from '@sushiswap/ui'
import { CircleIcon } from '@sushiswap/ui/icons/CircleIcon'

import {
  type Difficulty,
  getDifficulties,
} from '@sushiswap/graph-client/strapi'
import { classNames } from '@sushiswap/ui'
import { AcademyIcon } from '../../components/icons'
import { DOCS_URL } from '../../constants'
import { DIFFICULTY_ELEMENTS } from '../contants'

function DifficultyCard({ difficulty }: { difficulty: Difficulty }) {
  const slug = difficulty.slug as keyof typeof DIFFICULTY_ELEMENTS

  const { color, Icon } = DIFFICULTY_ELEMENTS[slug]
  const isTechnicalCard = slug === 'technical'

  return (
    <a
      href={isTechnicalCard ? DOCS_URL : `/academy/explore?difficulty=${slug}`}
      target={isTechnicalCard ? '_blank' : '_self'}
      rel="noreferrer"
      className="md:h-[405px] py-8 md:py-[50px] px-[30px] bg-slate-800 rounded-[30px] flex flex-col justify-between border border-transparent hover:border-slate-600 group space-y-4"
    >
      <AcademyIcon Icon={Icon} color={color} />

      <div className="space-y-5">
        <div className="relative flex items-center h-10">
          <Chip variant="ghost">
            <div className="flex gap-2 items-center">
              <CircleIcon width={8} height={8} fill={color} stroke={color} />
              {difficulty.label}
            </div>
          </Chip>
          <div
            className={classNames(
              'absolute inset-y-0 right-0 flex items-center justify-center',
              '!duration-300 transition-all translate-x-[20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
            )}
          >
            <div className="bg-[#3B7EF6] rounded-full p-3">
              <ArrowRightIcon className="w-4 h-4 " />
            </div>
          </div>
        </div>
        <p className="text-xl font-bold sm:text-2xl">
          {difficulty.longDescription}
        </p>
      </div>
    </a>
  )
}

export async function DifficultyCardBar() {
  const difficulties = await getDifficulties()

  return (
    <div
      className={classNames(
        'overflow-x-auto gap-5 sm:gap-6 grid grid-cols-[repeat(3,minmax(306px,1fr))] scroll',
      )}
    >
      {difficulties.map((difficulty) => (
        <DifficultyCard key={difficulty.id} difficulty={difficulty} />
      ))}
    </div>
  )
}
