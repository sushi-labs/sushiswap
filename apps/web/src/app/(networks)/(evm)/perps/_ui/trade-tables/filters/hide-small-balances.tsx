import { Checkbox } from '@sushiswap/ui'
import { useTradeTables } from '../trade-tables-provider'

export const HideSmallBalances = () => {
  const {
    state: { hideSmallBalances },
    mutate: { setHideSmallBalances },
  } = useTradeTables()
  return (
    <div
      onClick={() => {
        setHideSmallBalances(!hideSmallBalances)
      }}
      onKeyDown={() => {
        setHideSmallBalances(!hideSmallBalances)
      }}
      className="flex items-center gap-1 whitespace-nowrap text-xs font-medium"
    >
      <Checkbox
        className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-100 data-[state="checked"]:!border-blue'
        checked={hideSmallBalances}
        onCheckedChange={(checked) => {
          setHideSmallBalances(checked as boolean)
        }}
      />
      <div>Hide Small Balances</div>
    </div>
  )
}
