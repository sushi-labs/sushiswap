import { Form, Input } from '@sushiswap/ui'
import { CreateStreamFormData } from 'features/stream/CreateForm/types'
import { Controller, useFormContext } from 'react-hook-form'

export const GeneralDetailsSection = () => {
  const { control, watch } = useFormContext<CreateStreamFormData>()
  // @ts-ignore
  const token = watch('token')

  return (
    <Form.Section
      title="General Details"
      description="Furo allows for creating a vested stream using your Bentobox balance."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Control label="Start date">
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <>
                  <Input.DatetimeLocal onChange={onChange} value={value} error={!!error?.message} />
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
                  <Input.DatetimeLocal onChange={onChange} value={value} error={!!error?.message} />
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
                <Input.Address placeholder="0x..." onChange={onChange} value={value} error={!!error?.message} />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </Form.Control>
    </Form.Section>
  )
}
