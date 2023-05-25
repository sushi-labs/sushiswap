import { DuplicateIcon, TrashIcon } from '@heroicons/react/solid'
import React, { FC, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { useImportErrorContext } from '../../../../vesting/CreateMultipleForm/ImportErrorContext'
import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'

export const ActionsCell: FC<CellProps> = ({ row, index }) => {
  const { errors, setErrors } = useImportErrorContext<CreateMultipleStreamFormSchemaType>()
  const { control } = useFormContext<CreateMultipleStreamFormSchemaType>()
  const { append, remove } = useFieldArray({
    control,
    name: 'streams',
  })

  const onRemove = useCallback(() => {
    if (remove) {
      console.log(index)

      remove(index)
    }

    const _errors = { ...errors }
    if (_errors?.streams?.[index]) {
      delete _errors.streams[index]
      setErrors(_errors)
    }
  }, [errors, index, remove, setErrors])

  return (
    <div className="flex items-center gap-5 pl-3 h-[54px]">
      <div className="flex items-center">
        <IconButton icon={TrashIcon} iconProps={{ width: 20, height: 20 }} onClick={onRemove} />
      </div>
      <div className="flex items-center">
        <IconButton icon={DuplicateIcon} iconProps={{ width: 20, height: 20 }} onClick={() => append(row)} />
      </div>
    </div>
  )
}
