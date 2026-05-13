import { CheckboxSetting } from '~evm/perps/_ui/_common'
import { useVaultTables } from '../vault-tables-provider'

export const AggregateTradeHistory = () => {
  const {
    state: { shouldAggregateTradeHistory },
    mutate: { setShouldAggregateTradeHistory },
  } = useVaultTables()
  return (
    <CheckboxSetting
      value={shouldAggregateTradeHistory}
      onChange={setShouldAggregateTradeHistory}
      label="Aggregate"
    />
  )
}
