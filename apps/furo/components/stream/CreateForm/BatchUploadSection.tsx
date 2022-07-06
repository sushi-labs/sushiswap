import { getAddress } from '@ethersproject/address'
import { Dropzone, Form } from '@sushiswap/ui'
import { useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateStreamFormData } from './types'

interface UploadEntry {
  tokenAddress: string
  startDate: string
  recipient: string
  cliffEndDate: string
  cliffAmount: string
  payoutPerPeriod: string
  amountOfPeriods: string
  periodLength: string
}

export const BatchUploadSection = () => {
  const { control, watch } = useFormContext<CreateStreamFormData>()
  // @ts-ignore
  const currency = watch('currency')

  const onDrop = useCallback(
    (onChange: (...events: unknown[]) => void) => (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          const { result } = reader
          if (typeof result === 'string') {
            const arr = result.split('\r\n')
            const points = arr.reduce<UploadEntry[]>((acc, cur) => {
              if (cur !== '') {
                const [
                  tokenAddress,
                  startDate,
                  recipient,
                  cliffEndDate,
                  cliffAmount,
                  payoutPerPeriod,
                  amountOfPeriods,
                  periodLength,
                ] = cur.split(',')
                acc.push({
                  tokenAddress: getAddress(tokenAddress),
                  startDate,
                  recipient: getAddress(recipient),
                  cliffEndDate,
                  cliffAmount,
                  payoutPerPeriod,
                  amountOfPeriods,
                  periodLength,
                })
              }

              return acc
            }, [])

            onChange(points)
          }
        }

        reader.readAsText(file)
      })
    },
    []
  )

  return (
    <Form.Section
      title="Batch Upload"
      description="Furo allows you to create a vested or non vested stream using your wallet or BentoBox balance."
    >
      <Form.Control label="Upload">
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <Dropzone
                accept={{
                  'text/csv': ['.csv'],
                }}
                onDrop={onDrop(onChange)}
              />
            )
          }}
        />
      </Form.Control>
    </Form.Section>
  )
}
