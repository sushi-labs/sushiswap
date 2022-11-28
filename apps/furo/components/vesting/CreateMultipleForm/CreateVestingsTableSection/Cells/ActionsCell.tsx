import { DuplicateIcon, TrashIcon } from '@heroicons/react/solid'
import { IconButton } from '@sushiswap/ui'
import React, { FC, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { useImportErrorContext } from '../../ImportErrorContext'
import { CreateMultipleVestingFormSchemaType } from '../../schema'
import { CellProps } from './types'

export const ActionsCell: FC<CellProps> = ({ row, index }) => {
  const { errors, setErrors } = useImportErrorContext<CreateMultipleVestingFormSchemaType>()
  const { control } = useFormContext<CreateMultipleVestingFormSchemaType>()
  const { append, remove } = useFieldArray({
    control,
    name: 'vestings',
  })

  const onRemove = useCallback(() => {
    if (remove) {
      remove(index)
    }

    const _errors = { ...errors }
    if (_errors?.vestings?.[index]) {
      delete _errors.vestings[index]
      setErrors(_errors)
    }
  }, [errors, index, remove, setErrors])

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <IconButton onClick={onRemove}>
          <TrashIcon width={20} height={20} className="text-slate-300" />
        </IconButton>
      </div>
      <div className="flex items-center">
        <IconButton onClick={() => append(row)}>
          <DuplicateIcon width={20} height={20} className="text-slate-300" />
        </IconButton>
      </div>
    </div>
  )
}
