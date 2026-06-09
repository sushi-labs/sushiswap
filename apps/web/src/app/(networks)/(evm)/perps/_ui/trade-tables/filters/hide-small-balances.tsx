import { CheckboxSetting } from '../../_common'
import { useTradeTables } from '../trade-tables-provider'

export const HideSmallBalances = () => {
  const {
    state: { hideSmallBalances },
    mutate: { setHideSmallBalances },
  } = useTradeTables()
  return (
    <CheckboxSetting
      value={hideSmallBalances}
      onChange={setHideSmallBalances}
      label="Hide Small Balances"
    />
  )
}
