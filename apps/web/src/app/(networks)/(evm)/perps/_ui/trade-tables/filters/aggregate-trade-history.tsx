import { Checkbox } from '@sushiswap/ui'
import { useTradeTables } from '../trade-tables-provider'

export const AggregateTradeHistory = () => {
  const {
    state: { shouldAggregateTradeHistory },
    mutate: { setShouldAggregateTradeHistory },
  } = useTradeTables()
  return (
    <div
      onClick={() => {
        setShouldAggregateTradeHistory(!shouldAggregateTradeHistory)
      }}
      onKeyDown={() => {
        setShouldAggregateTradeHistory(!shouldAggregateTradeHistory)
      }}
      className="flex items-center gap-1 whitespace-nowrap text-xs font-medium"
    >
      <Checkbox
        className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-100 data-[state="checked"]:!border-blue'
        checked={shouldAggregateTradeHistory}
        onCheckedChange={(checked) => {
          setShouldAggregateTradeHistory(checked as boolean)
        }}
      />
      <div>Aggregate</div>
    </div>
  )
}
