import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  TRADE_TYPES,
  type TradeType,
  useAssetState,
} from '../asset-state-provider'

const REGULAR_TRADE_TYPES = TRADE_TYPES.slice(0, 2)
const PRO_TRADE_TYPES = TRADE_TYPES.slice(2)

export const TradeTypeSelect = () => {
  const {
    state: { tradeType },
    mutate: { setTradeType },
  } = useAssetState()

  const isProTrade = useMemo(() => {
    return PRO_TRADE_TYPES.includes(tradeType)
  }, [tradeType])

  return (
    <Tabs
      value={tradeType}
      onValueChange={(value) => setTradeType(value as TradeType)}
    >
      <TabsList className="grid grid-cols-3 !h-9 !p-0.5">
        {REGULAR_TRADE_TYPES.map((_tradeType) => (
          <TabsTrigger
            key={_tradeType}
            className="col-span-1 capitalize text-xs"
            value={_tradeType}
          >
            {_tradeType}
          </TabsTrigger>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <TabsTrigger
              className="col-span-1 capitalize text-xs w-full"
              value={isProTrade ? tradeType : 'Pro'}
            >
              <div className="flex items-center w-full gap-1 justify-center">
                {isProTrade ? tradeType : 'Pro'}
                <ChevronDownIcon className="ml-1 w-3 h-3" />
              </div>
            </TabsTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {PRO_TRADE_TYPES.map((_tradeType) => (
              <DropdownMenuItem key={_tradeType} className="!p-0 ">
                <TabsTrigger
                  className="w-full capitalize text-xs !justify-start"
                  value={_tradeType}
                >
                  {_tradeType}
                </TabsTrigger>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TabsList>
    </Tabs>
  )
}
