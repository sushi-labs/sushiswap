import { Checkbox } from '@sushiswap/ui'
import { useUserState } from '~evm/perps/user-provider'

export const AggregateTradeHistory = () => {
  const {
    state: { aggregateFillsByTime },
    mutate: { setAggregateFillsByTime },
  } = useUserState()
  return (
    <div
      onClick={() => {
        setAggregateFillsByTime(!aggregateFillsByTime)
      }}
      onKeyDown={() => {
        setAggregateFillsByTime(!aggregateFillsByTime)
      }}
      className="flex items-center gap-1 whitespace-nowrap text-xs font-medium"
    >
      <Checkbox
        className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-100 data-[state="checked"]:!border-blue'
        checked={aggregateFillsByTime}
        onCheckedChange={(checked) => {
          setAggregateFillsByTime(checked as boolean)
        }}
      />
      <div>Aggregate</div>
    </div>
  )
}
