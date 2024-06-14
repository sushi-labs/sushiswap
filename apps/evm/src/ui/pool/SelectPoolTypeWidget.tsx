'use client'

import { RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react-v1/solid'
import { FormSection, classNames } from '@sushiswap/ui'
import { CheckIcon } from '@sushiswap/ui'
import React, { FC, memo } from 'react'
import { PoolFinderType } from 'src/lib/wagmi/systems/PoolFinder/types'

const POOL_OPTIONS = [
  {
    value: PoolFinderType.ConcentratedLiquidity,
    title: 'Concentrated Liquidity Pool',
    subtitle: 'Yields the highest returns',
  },
  {
    value: PoolFinderType.Stable,
    title: 'Stable Pool',
    subtitle: 'Suitable for stable pairs',
  },
  {
    value: PoolFinderType.Classic,
    title: 'Classic Pool',
    subtitle: 'Suitable for regular pairs',
  },
]

interface SelectPoolTypeWidgetProps {
  poolType: PoolFinderType
  setPoolType(type: PoolFinderType): void
  includeConcentrated?: boolean
}

export const SelectPoolTypeWidget: FC<SelectPoolTypeWidgetProps> = memo(
  function SelectPoolTypeWidget({
    poolType,
    setPoolType,
    includeConcentrated = true,
  }) {
    return (
      <FormSection
        title="Pool type"
        description="Select your preferred pool type."
      >
        <RadioGroup
          value={poolType}
          onChange={setPoolType}
          className="grid grid-cols-2 gap-4"
        >
          {POOL_OPTIONS.filter((el) =>
            el.value === PoolFinderType.ConcentratedLiquidity
              ? includeConcentrated
              : true,
          ).map((option) => (
            <RadioGroup.Option
              key={option.value}
              value={option.value}
              testdata-id={`pool-type-${option.title
                .replace(' ', '-')
                .toLowerCase()}`}
              className={({ checked }) =>
                classNames(
                  checked ? 'ring ring-blue' : '',
                  'relative px-5 py-3 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer',
                )
              }
            >
              {({ checked }) => (
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-slate-50">
                    {option.title}
                    {option.value === PoolFinderType.ConcentratedLiquidity && (
                      <StarIcon
                        width={12}
                        height={12}
                        className="text-yellow"
                      />
                    )}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-slate-400 text-slate-600">
                    {checked && (
                      <div className="absolute right-3 bg-blue text-white rounded-full p-0.5">
                        <CheckIcon width={12} height={12} />
                      </div>
                    )}
                    {option.subtitle}
                  </span>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </FormSection>
    )
  },
)
