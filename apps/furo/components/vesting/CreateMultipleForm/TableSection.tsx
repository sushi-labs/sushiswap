import { PlusIcon } from '@heroicons/react/solid'
import { Button, classNames, Typography } from '@sushiswap/ui'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { stepConfigurations } from '../CreateForm'
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
      <div className="w-full max-w-5xl">
        <div
          className={classNames(
            fields?.length === 0 ? 'rounded-2xl' : 'rounded-t-2xl',
            'bg-slate-800 rounded-t-xl grid grid-cols-[100px_160px_100px_160px_160px_160px_80px] gap-y-3 gap-x-2 py-[18px] px-6'
          )}
        >
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
            Total Amount
          </Typography>
          <Typography variant="sm" weight={500} className="text-slate-500">
            Vesting Schedule
          </Typography>
          <span />
        </div>
        <div className="flex flex-col bg-slate-700 rounded-b-2xl">
          {fields?.map((field, index) => (
            <TableSectionRow
              index={index}
              key={index}
              control={control}
              onRemove={remove}
              onCopy={append}
              last={fields?.length === index + 1}
            />
          ))}
        </div>
        <div className="flex px-2 mt-1">
          <Button
            type="button"
            variant="empty"
            size="sm"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={() =>
              append({
                currency: undefined,
                cliff: false,
                startDate: undefined,
                recipient: undefined,
                cliffEndDate: undefined,
                cliffAmount: '',
                stepPayouts: 1,
                stepAmount: '',
                stepConfig: stepConfigurations[0],
                fundSource: undefined,
                insufficientBalance: false,
              })
            }
          >
            Add Item
          </Button>
        </div>
      </div>
    </div>
  )
}
