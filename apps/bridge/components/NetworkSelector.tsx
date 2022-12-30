import { ChevronDownIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { NetworkIcon, Typography } from '@sushiswap/ui'
import React, { FC, useCallback, useState } from 'react'

import { NetworkSelectorOverlay } from './NetworkSelectorOverlay'

interface NetworkSelectorProps {
  label: string
  value: ChainId
  onChange(chain: ChainId): void
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false)

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <div className="flex flex-col">
      <Typography variant="xs" className="text-slate-400" weight={500}>
        {label}
      </Typography>
      <div className="flex flex-row justify-between">
        <button
          type="button"
          className="relative flex items-center gap-1 py-1 text-sm font-medium text-slate-200 hover:text-slate-50"
          onClick={() => setOpen(true)}
        >
          <NetworkIcon chainId={value} width="16px" height="16px" className="mr-1" />
          {chains[value].name.split(' ')[0]} <ChevronDownIcon width={16} height={16} />
        </button>
      </div>
      <NetworkSelectorOverlay open={open} onClose={onClose} onSelect={onChange} selected={value} />
    </div>
  )
}
