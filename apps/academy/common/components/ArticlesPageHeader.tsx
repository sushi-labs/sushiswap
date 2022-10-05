import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { classNames, Select, useBreakpoint } from '@sushiswap/ui'
import { LooperBg } from 'common/assets/LooperBg'
import { FC, useLayoutEffect, useState } from 'react'

import { defaultSidePadding } from '../helpers'
import { GradientWrapper } from './'

interface ArticlesPagesHeader {
  title: string
  difficulties: any[] // TODO: change
  selectedDifficulty: any
  handleSelectDifficulty: (d: any) => void
}

const baseBg = [113, 285]
const smBg = [226, 570]

export const ArticlesPageHeader: FC<ArticlesPagesHeader> = ({
  title,
  // difficulties,
  selectedDifficulty,
  handleSelectDifficulty,
}) => {
  const difficulties = ['Beginner', 'Advanced', 'Technical']
  const { isSm } = useBreakpoint('sm')
  const [[bgHeight, bgWidth], setBgDimensions] = useState(baseBg)
  useLayoutEffect(() => {
    setBgDimensions(isSm ? smBg : baseBg)
  }, [isSm])

  return (
    <div className="bg-slate-800 h-[113px] sm:h-[226px] relative">
      <div
        className={classNames(
          defaultSidePadding,
          'flex items-center justify-between w-full h-full max-w-6xl gap-4 mx-auto'
        )}
      >
        <div className="absolute bottom-0 right-0 opacity-20">
          <LooperBg height={bgHeight} width={bgWidth} />
        </div>
        <div className="z-10">
          <p className="text-sm sm:text-[22px] sm:font-medium">Articles</p>
          <p className="text-[28px] sm:text-[52px] sm:font-medium">{title}</p>
        </div>

        <Select
          className="hidden w-1/2 sm:w-auto sm:flex"
          value={difficulties}
          onChange={handleSelectDifficulty}
          button={
            <GradientWrapper className="h-[54px] w-60 rounded-lg">
              <Listbox.Button
                type="button"
                className="flex items-center justify-between w-full h-full gap-2 px-6 rounded-lg bg-slate-800 text-slate-50"
              >
                <span className="text-lg min-w-max">{selectedDifficulty ?? 'Select Difficulty'}</span>
                <ChevronDownIcon width={12} height={12} aria-hidden="true" />
              </Listbox.Button>
            </GradientWrapper>
          }
        >
          <Select.Options className="!bg-slate-700 py-4 px-2 flex flex-col">
            {difficulties?.map((d, i) => (
              <Select.Option key={i} value={d} className="border-0 !cursor-pointer grid group">
                {/* {d.attributes.name} */}
                {d}
              </Select.Option>
            ))}
          </Select.Options>
        </Select>
      </div>
    </div>
  )
}
