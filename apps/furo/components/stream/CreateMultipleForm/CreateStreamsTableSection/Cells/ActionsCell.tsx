import { DuplicateIcon, TrashIcon } from '@heroicons/react/solid'
import { IconButton } from '@sushiswap/ui'
import React, { Dispatch, FC, SetStateAction, useCallback } from 'react'
import { FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType } from '../../schema'
import { CellProps } from './types'

interface ActionsCellProps extends CellProps {
  append?: UseFieldArrayAppend<CreateMultipleStreamFormSchemaType, 'streams'>
  remove?: UseFieldArrayRemove
  importErrors?: FieldErrors<CreateMultipleStreamFormSchemaType>
  setImportErrors?: Dispatch<SetStateAction<FieldErrors<CreateMultipleStreamFormSchemaType>>>
}

export const ActionsCell: FC<ActionsCellProps> = ({ row, index, append, remove, importErrors, setImportErrors }) => {
  const onRemove = useCallback(() => {
    if (remove) {
      remove(index)
    }

    const errors = { ...importErrors }
    if (errors?.streams?.[index]) {
      delete errors.streams[index]
      if (setImportErrors) {
        setImportErrors(errors)
      }
    }
  }, [importErrors, index, remove, setImportErrors])

  return (
    <div className="flex items-center gap-2">
      {remove && (
        <div className="flex items-center">
          <IconButton onClick={onRemove}>
            <TrashIcon width={20} height={20} className="text-slate-300" />
          </IconButton>
        </div>
      )}
      {append && (
        <div className="flex items-center">
          <IconButton onClick={() => append(row)}>
            <DuplicateIcon width={20} height={20} className="text-slate-300" />
          </IconButton>
        </div>
      )}
    </div>
  )
}
