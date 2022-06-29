import { Form, Input } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateStreamFormData } from './types'

export const GeneralDetailsSection = () => {
  const { control, watch } = useFormContext<CreateStreamFormData>()
  // @ts-ignore
  const currency = watch('currency')

  return (
    <Form.Section
      title="General Details"
      description="Furo allows you to create a vested or non vested stream using your wallet or BentoBox balance."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Form.Control label="Start date">
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <>
                  <Input.DatetimeLocal value={value} onChange={onChange} error={!!error?.message} />
                  <Form.Error message={error?.message} />
                </>
              )
            }}
          />
        </Form.Control>
        <Form.Control label="End date">
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <>
                  <Input.DatetimeLocal value={value} onChange={onChange} error={!!error?.message} />
                  <Form.Error message={error?.message} />
                </>
              )
            }}
          />
        </Form.Control>
      </div>
      <Form.Control label="Recipient">
        <Controller
          control={control}
          name="recipient"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Web3Input.Ens
                  id="recipient"
                  value={value}
                  onChange={onChange}
                  // @ts-ignore
                  error={!!error?.message}
                  placeholder="Address or ENS Name"
                />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </Form.Control>
    </Form.Section>
  )
}
