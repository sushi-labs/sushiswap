import { PlusIcon } from '@heroicons/react/solid'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames, Typography } from '@sushiswap/ui'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormData } from '../types'
import { TableSectionRow } from './TableSectionRow'

export const TableSection = () => {
  const { control, watch } = useFormContext<CreateMultipleStreamFormData>()

  // TODO: cast as never until
  // https://github.com/react-hook-form/react-hook-form/issues/4055#issuecomment-950145092 gets fixed
  const { append, remove } = useFieldArray({
    control,
    name: 'streams',
    shouldUnregister: true,
  } as never)

  // @ts-ignore
  const fields = watch('streams')

  return (
    <div>
      <div className="w-full max-w-5xl">
        <div
          className={classNames(
            fields?.length === 0 ? 'rounded-2xl' : 'rounded-t-2xl',
            'bg-slate-800 rounded-t-xl grid grid-cols-[120px_110px_110px_192px_185px_185px_60px] gap-y-3 gap-x-2 py-[18px] px-6'
          )}
        >
          <Typography variant="sm" weight={700} className="text-slate-500">
            Currency
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Fund Source
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Amount
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Recipient
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Start Date
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            End Date
          </Typography>
          <div />
        </div>
        <div className="flex flex-col bg-slate-700 rounded-b-2xl">
          {fields.map((field, index) => (
            <TableSectionRow index={index} key={index} control={control} onRemove={remove} onCopy={append} />
          ))}
        </div>
      </div>
      <div className="flex px-2 mt-1">
        <Button
          type="button"
          variant="empty"
          size="sm"
          startIcon={<PlusIcon width={16} height={16} />}
          onClick={() =>
            append({
              fundSource: FundSource.WALLET,
              amount: undefined,
              recipient: '',
              startDate: '',
              endDate: '',
            })
          }
        >
          Add Item
        </Button>
      </div>
    </div>
  )
}
