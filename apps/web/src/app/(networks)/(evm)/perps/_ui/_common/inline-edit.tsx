'use client'
import PencilIcon from '@heroicons/react/20/solid/PencilIcon'
import { TextField } from '@sushiswap/ui'
import { useEffect, useRef, useState } from 'react'
import { TableButton } from './table-button'

export const InlineEdit = ({
  value,
  rawValue,
  onConfirm,
  isPending,
}: {
  value: string
  rawValue: string
  onConfirm: (value: string) => void | Promise<void>
  isPending?: boolean
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [localValue, setLocalValue] = useState(rawValue)

  useEffect(() => {
    setLocalValue(rawValue)
  }, [rawValue])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  return (
    <div
      className="flex items-center gap-2"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setEditing(false)
        }
      }}
    >
      {editing ? (
        <div className="border max-h-[25px] px-1 rounded-md border-[#FFFFFF1A] flex items-center justify-center">
          <TextField
            type="number"
            ref={inputRef}
            value={localValue}
            onValueChange={setLocalValue}
            onKeyDown={(e) => {
              if (editing && e.key === 'Escape') {
                setEditing(false)
              }
            }}
            variant="naked"
            className="!min-w-[50px] !text-xs font-medium "
            disabled={isPending}
          />
        </div>
      ) : (
        <span className="font-medium whitespace-nowrap">{value}</span>
      )}
      <TableButton
        onClick={() => {
          if (editing) {
            void onConfirm(localValue)
          }
          setEditing((editing) => !editing)
        }}
        type="button"
        disabled={isPending}
      >
        {editing ? 'Confirm' : <PencilIcon className="w-4 h-4" />}
      </TableButton>
    </div>
  )
}
