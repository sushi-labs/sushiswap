import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { classNames, Select, Typography, useBreakpoint } from '@sushiswap/ui'
import { LooperBg } from 'common/assets/LooperBg'
import { defaultSidePadding } from 'pages'
import { FC } from 'react'

import { GradientWrapper } from './'

interface ArticlesPagesHeader {
  title: string
  difficulties: any[] // TODO: change
  selectedDifficulty: any
  handleSelectDifficulty: (d: any) => void
}
export const ArticlesPagesHeader: FC<ArticlesPagesHeader> = ({
  title,
  difficulties,
  selectedDifficulty,
  handleSelectDifficulty,
}) => {
  const { isSm } = useBreakpoint('sm')

  return (
    <div className="bg-slate-800 h-[113px] sm:h-[226px] relative">
      <div
        className={classNames(
          defaultSidePadding,
          'flex items-center justify-between w-full h-full max-w-6xl gap-4 mx-auto'
        )}
      >
        <div className="absolute bottom-0 right-0 opacity-20">
          <LooperBg height={isSm ? 226 : 113} width={isSm ? 570 : 285} />
        </div>
        <div>
          <p className="text-sm sm:text-[22px] sm:font-medium">Articles</p>
          <p className="text-[28px] sm:text-[52px] sm:font-medium">{title}</p>
        </div>

        <Select
          className="hidden w-1/2 sm:w-auto sm:flex"
          button={
            <GradientWrapper className="h-[54px] w-60 rounded-lg">
              <Listbox.Button
                type="button"
                className="flex items-center justify-between w-full h-full gap-2 px-6 rounded-lg bg-slate-800 text-slate-50"
              >
                <span className="text-lg min-w-max">
                  {selectedDifficulty
                    ? difficulties?.find(({ id }) => id === selectedDifficulty)?.attributes?.name ?? 'Select Difficulty'
                    : 'Select Difficulty'}
                </span>
                <ChevronDownIcon width={12} height={12} aria-hidden="true" />
              </Listbox.Button>
            </GradientWrapper>
          }
        >
          <Select.Options className="!bg-slate-700 p-6 gap-6 flex flex-col">
            {difficulties?.map(({ id, attributes }, i) => (
              <Typography weight={500} variant="sm" key={i} onClick={() => handleSelectDifficulty(id)}>
                {attributes.name}
              </Typography>
            ))}
          </Select.Options>
        </Select>
      </div>
    </div>
  )
}
