import React, { FC, memo } from 'react'

import { SelectFee } from './SelectFee'
import { SelectNetwork } from './SelectNetwork'
import { SelectPoolType } from './SelectPoolType'
import { SelectTokens } from './SelectTokens'

export const SelectPoolDetailsWidget: FC = memo(function SelectPoolDetailsWidget() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <SelectNetwork />
      <SelectTokens />
      <div className="h-px bg-slate-200/[0.05] w-full" />
      <SelectPoolType />
      <SelectFee />
    </div>
  )
})
