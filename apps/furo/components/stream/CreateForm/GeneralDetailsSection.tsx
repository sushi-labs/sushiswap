import { Form, Input } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import { Controller, useFormContext } from 'react-hook-form'

import { CreateStreamBaseSchemaType } from './schema'

export const GeneralDetailsSection = () => {
  const { control } = useFormContext<CreateStreamBaseSchemaType>()

  return (
    <Form.Section
      title="General Details"
      description="Furo allows you to create a vested or non vested stream using your wallet or BentoBox balance."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Form.Control label="Start date">
          <Controller
            control={control}
            name="dates.startDate"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <>
                  <Input.DatetimeLocal
                    value={value?.toISOString().slice(0, 16) || ''}
                    onChange={(value) => onChange(new Date(value))}
                    error={!!error?.message}
                    className="!ring-offset-slate-900 cursor-pointer"
                  />
                  <Form.Error message={error?.message} />
                </>
              )
            }}
          />
        </Form.Control>
        <Form.Control label="End date">
          <Controller
            control={control}
            name="dates.endDate"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <>
                  <Input.DatetimeLocal
                    value={value?.toISOString().slice(0, 16) || ''}
                    onChange={(value) => onChange(new Date(value))}
                    error={!!error?.message}
                    className="!ring-offset-slate-900 cursor-pointer"
                  />
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
                  error={!!error?.message}
                  placeholder="Address or ENS Name"
                  className="ring-offset-slate-900"
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
