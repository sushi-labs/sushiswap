import { useUserState } from '~evm/perps/user-provider'
import { CheckboxSetting } from '../../_common/checkbox-setting'

export const AggregateTradeHistory = () => {
  const {
    state: { aggregateFillsByTime },
    mutate: { setAggregateFillsByTime },
  } = useUserState()
  return (
    <CheckboxSetting
      value={aggregateFillsByTime}
      onChange={setAggregateFillsByTime}
      label="Aggregate Trade History"
    />
  )
}
