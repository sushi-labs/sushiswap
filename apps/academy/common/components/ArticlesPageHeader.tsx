import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useBreakpoint } from '@sushiswap/hooks'
import { classNames, Container, Select } from '@sushiswap/ui'
import { LooperBg } from 'common/assets/LooperBg'
import { FC, useLayoutEffect, useState } from 'react'

import { DEFAULT_SIDE_PADDING } from '../helpers'
import { GradientWrapper, SelectOption } from './'
import { DifficultyEntity, Maybe } from '.mesh'

interface ArticlesPagesHeader {
  title: Maybe<string> | undefined
  difficulties: DifficultyEntity[]
  selectedDifficulty: Maybe<DifficultyEntity> | undefined
  onSelect(difficulty: DifficultyEntity): void
}

const baseBg = [113, 285]
const smBg = [226, 570]

export const ArticlesPageHeader: FC<ArticlesPagesHeader> = ({ title, difficulties, selectedDifficulty, onSelect }) => {
  const { isSm } = useBreakpoint('sm')
  const [[bgHeight, bgWidth], setBgDimensions] = useState(baseBg)
  useLayoutEffect(() => {
    setBgDimensions(isSm ? smBg : baseBg)
  }, [isSm])

  return (
    <section className="bg-slate-800 h-[113px] sm:h-[226px] relative">
      <Container
        maxWidth="6xl"
        className={classNames(DEFAULT_SIDE_PADDING, 'flex items-center justify-between h-full gap-4 mx-auto')}
      >
        <div className="absolute bottom-0 right-0 opacity-20">
          <LooperBg height={bgHeight} width={bgWidth} />
        </div>
        <div className="z-10">
          <p className="text-sm sm:text-xl sm:font-medium">Articles</p>
          <p className="text-3xl sm:text-5xl sm:font-medium">{title}</p>
        </div>

        <Select
          className="hidden w-1/2 sm:w-auto sm:flex"
          value={selectedDifficulty}
          onChange={onSelect}
          button={
            <GradientWrapper className="h-[54px] w-60 rounded-lg">
              <Listbox.Button
                type="button"
                className="flex items-center justify-between w-full h-full gap-2 px-6 rounded-lg bg-slate-800 text-slate-50"
              >
                <span className="text-lg min-w-max">
                  {selectedDifficulty?.attributes?.label ?? 'Select Difficulty'}
                </span>
                <ChevronDownIcon width={12} height={12} aria-hidden="true" />
              </Listbox.Button>
            </GradientWrapper>
          }
        >
          <Select.Options className="!bg-slate-700 p-2 space-y-1">
            {difficulties?.map((difficulty, i) => (
              <SelectOption
                key={i}
                value={difficulty}
                isSelected={difficulty.id === selectedDifficulty?.id}
                title={difficulty?.attributes?.name as string}
                className="px-4 text-base"
              />
            ))}
          </Select.Options>
        </Select>
      </Container>
    </section>
  )
}
