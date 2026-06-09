import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import { SortIcon } from '@sushiswap/ui/icons/SortIcon'
import {
  TRADE_FILTER_VALUES,
  type TradeFilterValueString,
  useTradeTables,
} from '../trade-tables-provider'

export const TradeFilter = () => {
  const {
    state: { tradeFilter, activeTab },
    mutate: { handleSetTradeFilter },
  } = useTradeTables()
  const _currentTradeFilter = tradeFilter?.[activeTab]

  return (
    <Select
      onValueChange={(t) => {
        handleSetTradeFilter({
          ...(tradeFilter ?? {}),
          [activeTab]: t as TradeFilterValueString,
        })
      }}
      value={_currentTradeFilter ?? undefined}
    >
      <SelectTrigger
        aria-label="Table Filter Select"
        className="!py-0 !px-2 !text-xs !max-h-[32px] !min-h-[32px] !h-[32px] max-w-fit capitalize cursor-pointer !text-perps-muted-50"
        asChild
      >
        <Button variant="perps-secondary" size="sm">
          <div className="flex items-center gap-1">
            {_currentTradeFilter ? (
              <div className="!text-perps-muted">
                <SelectValue />
              </div>
            ) : null}
            <SortIcon width={16} height={16} />
          </div>
        </Button>
      </SelectTrigger>

      <SelectContent className="!bg-black/10">
        {TRADE_FILTER_VALUES.map((type) => (
          <SelectItem
            key={type}
            value={`${activeTab}:${type}`}
            className="capitalize"
          >
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
