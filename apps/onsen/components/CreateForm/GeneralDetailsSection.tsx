import { Form, Input } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import { CreateIncentiveFormData } from 'components/CreateForm/types'
import { Controller, useFormContext } from 'react-hook-form'

export const GeneralDetailsSection = () => {
  const { control, watch } = useFormContext<CreateIncentiveFormData>()
  // @ts-ignore
  const [startDate, endDate, stakeTokenAddress] = watch(['startDate', 'endDate', 'stakeTokenAddress'])
  return (
    <Form.Section title="General Details" description="">
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
                <Web3Input.Ens
                  id="ensInput"
                  value={value}
                  onChange={onChange}
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
