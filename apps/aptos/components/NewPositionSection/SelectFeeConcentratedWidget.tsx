import React, { FC, memo, useMemo } from 'react'
import { ContentBlock } from '../ContentBlock'
import { RadioGroup } from '@headlessui/react'
// import { FeeAmount } from '@sushiswap/v3-sdk'
import { Skeleton, classNames } from '@sushiswap/ui'

export const FEE_OPTIONS = [
  {
    // value: FeeAmount.LOWEST,
    value: '0.01',
    subtitle: 'Best for very stable pairs.',
  },
  {
    value: '0.05',
    subtitle: 'Best for less volatile pairs.',
  },
  {
    value: '0.3',
    subtitle: 'Best for most pairs.',
  },
  {
    value: '1',
    subtitle: 'Best for volatile pairs.',
  },
]

export const SelectFeeConcentratedWidget = memo(function SelectFeeWidget(
  {
    // feeAmount,
    // setFeeAmount
  }
) {
  // const { data: pools, isLoading } = usePoolsByTokenPair(token0?.wrapped.id, token1?.wrapped.id)
  // const tvlDistribution = useMemo(() => {
  //   const tvlDistribution = new Map<(typeof FEE_OPTIONS)[number]['value'], number>()
  //   if (!pools) return tvlDistribution
  //   const totalTvl = pools?.reduce((acc, pool) => acc + Number(pool.totalValueLockedUSD), 0)
  //   pools?.forEach((pool) => {
  //     if (!FEE_OPTIONS.find((option) => option.value === Number(pool.feeTier))) return
  //     const tvlShare = pool.totalValueLockedUSD / totalTvl
  //     if (isNaN(tvlShare)) return
  //     tvlDistribution.set(Number(pool.feeTier), tvlShare)
  //   })
  //   return tvlDistribution
  // }, [pools])
  // return (
  //   <ContentBlock
  //   title={
  //     <>
  //       What percentage for <span className="text-gray-900 dark:text-white">fees</span> do you prefer?
  //     </>
  //   }
  //   >
  //   <RadioGroup
  //   // value={feeAmount}
  //   // onChange={setFeeAmount}
  //   className="grid grid-cols-2 gap-4"
  //   >
  //     {FEE_OPTIONS.map((option) => (
  //       <RadioGroup.Option
  //       testdata-id={`fee-option-${option.value}`}
  //       key={option.value}
  //       value={option.value}
  //       className={({ checked }) =>
  //         classNames(
  //           checked ? 'ring ring-blue' : '',
  //           'px-5 py-4 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
  //         )
  //       }
  //     >
  //       <div className="flex flex-col space-y-1">
  //         <span className="flex items-center space-x-2">
  //           <div className="font-medium text-gray-900 dark:text-slate-50">{option.value}% Fees </div>{' '}
  //           {/* {!isLoading ? (
  //             <>
  //               {tvlDistribution.get(option.value) && (
  //                 <div className="px-2 py-1 text-xs text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-[20px]">
  //                   {(tvlDistribution.get(option.value)! * 100)?.toFixed(0)}% Selected
  //                 </div>
  //               )}
  //             </>
  //           ) : (
  //             <Skeleton.Box className="w-[90px] h-[24px] rounded-[20px]" />
  //           )} */}
  //         </span>
  //         <span className="text-sm text-gray-500 dark:text-slate-400 text-slate-600">{option.subtitle}</span>
  //       </div>
  //     </RadioGroup.Option>
  //     ))}
  //   </RadioGroup>
  //   </ContentBlock>
  // )
})
