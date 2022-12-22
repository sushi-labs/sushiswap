import { classNames } from '@sushiswap/ui'
import React, { FC, memo } from 'react'

import { useAddPositionState } from '../../AddPositionProvider'
import { SelectFee } from './SelectFee'
import { SelectNetwork } from './SelectNetwork'
import { SelectPoolType } from './SelectPoolType'
import { SelectTokens } from './SelectTokens'

export const SelectPoolDetailsWidget: FC = memo(function SelectPoolDetailsWidget() {
  const { token0, token1 } = useAddPositionState()

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="border border-slate-200/10 bg-white/[0.04] rounded-lg px-3 divide-y divide-slate-200/[0.05]">
        <SelectNetwork />
        <SelectTokens />
      </div>
      <div className={classNames(token0 && token1 ? '' : 'opacity-30 pointer-events-none', 'flex flex-col gap-3')}>
        <span className="text-sm font-bold text-slate-200 flex-grow px-3">Details</span>
        <div className="border border-slate-200/10 bg-white/[0.04] rounded-lg px-3 divide-y divide-slate-200/[0.05]">
          <SelectPoolType />
          <SelectFee />
        </div>
      </div>
      <div className="h-px bg-slate-200/[0.05] w-full" />
    </div>
  )
})
