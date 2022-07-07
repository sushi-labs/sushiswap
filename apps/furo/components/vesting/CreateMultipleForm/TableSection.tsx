import { Typography } from '@sushiswap/ui'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { CreateMultipleVestingFormData } from '../types'
import { TableSectionRow } from './TableSectionRow'

export const TableSection = () => {
  const { control, watch } = useFormContext<CreateMultipleVestingFormData>()

  // TODO: cast as never until
  // https://github.com/react-hook-form/react-hook-form/issues/4055#issuecomment-950145092 gets fixed
  const { append, remove } = useFieldArray({
    control,
    name: 'vestings',
    shouldUnregister: true,
  } as never)

  // @ts-ignore
  const fields = watch('vestings')

  return (
    <div className="">
      <div className="w-full overflow-auto lg:overflow-visible max-w-5xl">
        <div className="bg-slate-800 rounded-t-xl grid lg:grid-cols-[100px_100px_100px_160px_auto] gap-y-3 gap-x-2 py-[18px] px-6">
          <Typography variant="sm" weight={500} className="text-slate-500">
            Currency
          </Typography>
          <Typography variant="sm" weight={500} className="text-slate-500">
            Recipient
          </Typography>
          <Typography variant="sm" weight={500} className="text-slate-500">
            Source
          </Typography>
          <Typography variant="sm" weight={500} className="text-slate-500">
            Start Date
          </Typography>
          <Typography variant="sm" weight={500} className="text-slate-500">
            Vesting Schedule
          </Typography>
        </div>
        <div className="flex flex-col gap-2 bg-slate-700 rounded-b-xl">
          {fields.map((field, index) => (
            <TableSectionRow index={index} key={index} control={control} onRemove={remove} onCopy={append} />
          ))}
        </div>
      </div>
    </div>
  )
}
