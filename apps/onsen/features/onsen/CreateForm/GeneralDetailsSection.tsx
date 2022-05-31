import { Form, Input } from '@sushiswap/ui'
import { CreateIncentiveFormData } from 'features/onsen/CreateForm/types'
import { Controller, useFormContext } from 'react-hook-form'

export const GeneralDetailsSection = () => {
  const { control, watch } = useFormContext<CreateIncentiveFormData>()
  // @ts-ignore
  const token = watch('token')

  return (
    <Form.Section title="General Details" description=''>
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
      <Form.Control label="Stake token address">
        <Controller
          control={control}
          name="stakeTokenAddress"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Input.Address value={value} placeholder="0x..." onChange={onChange} error={!!error?.message} />
                <Form.Error message={error?.message} />
              </>
            )
          }}
        />
      </Form.Control>
    </Form.Section>
  )
}
