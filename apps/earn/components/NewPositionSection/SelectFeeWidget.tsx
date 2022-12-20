import { Fee } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { classNames, Tooltip, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import React, { FC, memo } from 'react'

import { TRIDENT_ENABLED_NETWORKS } from '../../config'

interface SelectFeeWidgetProps {
  chainId: ChainId
  fee: number
  setFee(fee: number): void
}

export const FEE_MAP = [Fee.LOW, Fee.MEDIUM, Fee.DEFAULT, Fee.HIGH]
export const FEE_OPTIONS = [
  { value: Fee.LOW, title: '0.01%', subtitle: 'Best for stable pairs' },
  { value: Fee.MEDIUM, title: '0.05%', subtitle: 'Best for less volatile pairs' },
  { value: Fee.DEFAULT, title: '0.3%', subtitle: 'Best for most pairs' },
  { value: Fee.HIGH, title: '1.0%', subtitle: 'Best for volatile pairs' },
]

export const SelectFeeWidget: FC<SelectFeeWidgetProps> = memo(({ chainId, fee, setFee }) => {
  const widget = (
    <Widget
      id="selectFee"
      maxWidth={400}
      className={classNames(
        !TRIDENT_ENABLED_NETWORKS.includes(chainId) ? 'pointer-events-none opacity-40' : '',
        '!bg-slate-700'
      )}
    >
      <Widget.Content>
        <Widget.Header title="3. Select Fee Tier" className="!pb-3" />
        <div className="p-4 pt-1"></div>
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
})
