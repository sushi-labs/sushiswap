import { useBreakpoint } from '@sushiswap/hooks'
import {
  Container,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  classNames,
} from '@sushiswap/ui'
import { LooperBg } from 'common/assets/LooperBg'
import { FC, useEffect, useLayoutEffect, useState } from 'react'

import { DEFAULT_SIDE_PADDING } from '../helpers'
import { DifficultyEntity, Maybe } from '.mesh'

interface ArticlesPagesHeader {
  title: Maybe<string> | undefined
  difficulties: DifficultyEntity[]
  selectedDifficulty: string | undefined
  onSelect(index: string): void
}

const baseBg = [113, 285]
const smBg = [226, 570]

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const ArticlesPageHeader: FC<ArticlesPagesHeader> = ({
  title,
  difficulties,
  selectedDifficulty,
  onSelect,
}) => {
  const { isSm } = useBreakpoint('sm')
  const [[bgHeight, bgWidth], setBgDimensions] = useState(baseBg)

  useIsomorphicLayoutEffect(() => {
    setBgDimensions(isSm ? smBg : baseBg)
  }, [isSm])

  return (
    <section className="bg-slate-800 h-[113px] sm:h-[226px] relative">
      <Container
        maxWidth="6xl"
        className={classNames(
          DEFAULT_SIDE_PADDING,
          'flex items-center justify-between h-full gap-4 mx-auto',
        )}
      >
        <div className="absolute bottom-0 right-0 opacity-20">
          <LooperBg height={bgHeight} width={bgWidth} />
        </div>
        <div className="z-10">
          <p className="text-sm sm:text-xl sm:font-medium">Articles</p>
          <p className="text-3xl sm:text-5xl sm:font-medium">{title}</p>
        </div>

        <Select value={selectedDifficulty} onValueChange={onSelect}>
          <SelectTrigger placeholder="Select Difficulty">
            {selectedDifficulty
              ? difficulties[+selectedDifficulty]?.attributes?.label
              : ''}
          </SelectTrigger>
          <SelectContent>
            {difficulties?.map((difficulty, i) => (
              <SelectItem
                key={i}
                value={`${difficulty}`}
                title={difficulty?.attributes?.name as string}
                className="px-4 text-base"
              >
                {difficulty?.attributes?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Container>
    </section>
  )
}
