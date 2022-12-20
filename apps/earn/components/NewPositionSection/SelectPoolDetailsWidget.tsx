import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { classNames, Tooltip, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { PoolFinderType } from '@sushiswap/wagmi'
import React, { FC, memo } from 'react'

import { TRIDENT_ENABLED_NETWORKS } from '../../config'
import { FEE_OPTIONS } from './SelectFeeWidget'

interface SelectPoolDetailsWidgetProps {
  chainId: ChainId
  poolType: PoolFinderType
  setPoolType(type: PoolFinderType): void
  fee: number
  setFee(fee: number): void
}

const OPTIONS = [
  {
    value: PoolFinderType.Classic,
    title: 'Classic',
    subtitle: 'Suitable for regular pairs',
  },
  {
    value: PoolFinderType.Stable,
    title: 'Stable',
    subtitle: 'Suitable for stable pairs',
  },
  {
    value: PoolFinderType.ConcentratedLiquidity,
    title: 'Concentrated Liquidity',
    subtitle: 'Suitable for capital efficiency',
  },
]

export const SelectPoolDetailsWidget: FC<SelectPoolDetailsWidgetProps> = memo(
  ({ chainId, poolType, setPoolType, fee, setFee }) => {
    const widget = (
      <Widget id="selectPoolType" maxWidth={400} className="!bg-slate-800">
        <Widget.Content>
          <Widget.Header title="2. Pool Details" className="!pb-3" />
          <div className="flex flex-col gap-5 p-4 pt-1">
            <RadioGroup value={poolType} onChange={setPoolType} className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pool Type</span>
              <div className="grid grid-cols-2 gap-2">
                {OPTIONS.map(({ value, title, subtitle }) => (
                  <RadioGroup.Option
                    key={value}
                    value={value}
                    className={({ checked }) =>
                      classNames(
                        'rounded-lg p-2 cursor-pointer border',
                        `${
                          checked
                            ? 'ring-1 ring-blue shadow-md shadow-blue/50 border-blue'
                            : 'ring-0 hover:ring-1 hover:ring-slate-200/10 border-slate-200/10'
                        }`
                      )
                    }
                  >
                    {({ checked }) => (
                      <div className="relative">
                        {checked && (
                          <div className="absolute right-0 bg-blue rounded-full p-0.5">
                            <CheckIcon width={12} height={12} />
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-semibold text-slate-50">{title}</p>
                          <p className="text-[10px] font-medium text-slate-300">{subtitle}</p>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            <RadioGroup value={fee} onChange={setFee} className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pool Fee</span>
              <div className="grid grid-cols-2 gap-2">
                {FEE_OPTIONS.map(({ value, title, subtitle }) => (
                  <RadioGroup.Option
                    key={value}
                    value={value}
                    className={({ checked }) =>
                      classNames(
                        'rounded-lg p-2 cursor-pointer border',
                        `${
                          checked
                            ? 'ring-1 ring-blue shadow-md shadow-blue/50 border-blue'
                            : 'ring-0 hover:ring-1 hover:ring-slate-200/10 border-slate-200/10'
                        }`
                      )
                    }
                  >
                    {({ checked }) => (
                      <div className="relative">
                        {checked && (
                          <div className="absolute right-0 bg-blue rounded-full p-0.5">
                            <CheckIcon width={12} height={12} />
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-semibold text-slate-50">{title}</p>
                          <p className="text-[10px] font-medium text-slate-300">{subtitle}</p>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
        </Widget.Content>
      </Widget>
    )

    return !TRIDENT_ENABLED_NETWORKS.includes(chainId) ? (
      <Tooltip
        mouseEnterDelay={0.3}
        button={<div>{widget}</div>}
        panel={
          <Typography variant="xs" className="max-w-[220px]">
            This network does not allow changing the default pool type
          </Typography>
        }
      />
    ) : (
      widget
    )
  }
)
