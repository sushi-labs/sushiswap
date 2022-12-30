import { ChevronDownIcon } from '@heroicons/react/outline'
import { FundSource } from '@sushiswap/hooks'
import { Menu } from '@sushiswap/ui'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { ZFundSourceToFundSource } from '../../../../../lib/zod'
import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const FundSourceCell: FC<CellProps> = ({ row, index }) => {
  const { control } = useFormContext<CreateMultipleStreamFormSchemaType>()
  const _fundSource = ZFundSourceToFundSource.parse(row.fundSource)

  return (
    <Controller
      control={control}
      name={`streams.${index}.fundSource`}
      render={({ field: { onChange } }) => (
        <Menu
          button={
            <Menu.Button
              color="gray"
              className="!px-0 !text-slate-50"
              variant="empty"
              type="button"
              value={_fundSource}
            >
              <span className="text-sm font-medium capitalize truncate">{_fundSource?.toLowerCase() || 'Select'}</span>
              <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
            </Menu.Button>
          }
        >
          <Menu.Items className="!min-w-[unset] !w-fit">
            <Menu.Item onClick={() => onChange(FundSource.WALLET)}>Wallet</Menu.Item>
            <Menu.Item onClick={() => onChange(FundSource.BENTOBOX)}>BentoBox</Menu.Item>
          </Menu.Items>
        </Menu>
      )}
    />
  )
}
