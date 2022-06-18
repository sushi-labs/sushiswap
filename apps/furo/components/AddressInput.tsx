import { isAddress } from '@ethersproject/address'
import { classNames, Input } from '@sushiswap/ui'
import React, { FC, useEffect, useState } from 'react'
import { useEnsAddress } from 'wagmi'

export type AddressInput = {
  defaultValue?: string
  onChange(value: string | null): void
  className?: string
}

export const AddressInput: FC<AddressInput> = ({ defaultValue = '', onChange, className = '' }) => {
  const [localValue, setLocalValue] = useState<string>(defaultValue)
  const [error, setError] = useState<boolean>(false)

  const { data: ensAddress, isLoading } = useEnsAddress({ name: localValue, enabled: localValue.includes('.eth') })

  useEffect(() => {
    if (localValue.includes('.eth')) {
      // If ENS finished loading
      if (!isLoading) {
        if (ensAddress) {
          setError(false)
          onChange(ensAddress)
        } else {
          setError(true)
        }
      }
      // Not an ENS and not a valid address
    } else if (!isAddress(localValue)) {
      if (localValue === '') {
        onChange(null)
      } else {
        setError(true)
      }
      // Value is a valid address
    } else {
      setError(false)
      onChange(localValue)
    }
  }, [localValue, ensAddress, isLoading, onChange])

  useEffect(() => {
    if (error) onChange(null)
  }, [error, onChange])

  return (
    <>
      <Input.Address
        value={localValue}
        placeholder="Recipient (optional)"
        className={classNames(
          '!ring-offset-2 ring-blue !ring-offset-slate-900 !text-xs placeholder:text-slate-500 placeholder:font-medium',
          className
        )}
        onChange={(val) => {
          if (!isAddress(val) && val !== '') {
            setError(true)
          } else {
            setError(false)
          }
          setLocalValue(val)
        }}
        error={error}
      />
    </>
  )
}
