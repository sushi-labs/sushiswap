'use client'
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon'
import {
  Button,
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
} from './asset-state-provider'

const REGULAR_TRADE_TYPES = TRADE_TYPES.slice(0, 2)
const PRO_TRADE_TYPES = TRADE_TYPES.slice(2)

export const TradeTypeSelect = () => {
  const {
    state: { tradeType, asset },
    mutate: { setTradeType },
  } = useAssetState()

  const assetType = useMemo(() => {
    if (!asset) return 'perp'
    return asset.marketType
  }, [asset])

  const proTradeType = useMemo(() => {
    if (assetType === 'spot') {
      return ['scale', 'TWAP']
    }
    return TRADE_TYPES.slice(2)
  }, [assetType])

  const isProTrade = useMemo(() => {
    return PRO_TRADE_TYPES.includes(tradeType)
  }, [tradeType])

  return (
    <Tabs
      value={tradeType}
      onValueChange={(value) => setTradeType(value as TradeType)}
    >
      <TabsList className="grid grid-cols-3 !h-9 !p-0.5 border-none bg-transparent gap-1.5">
        {REGULAR_TRADE_TYPES.map((_tradeType) => (
          <TabsTrigger
            key={_tradeType}
            className="col-span-1 capitalize text-xs"
            value={_tradeType}
            asChild
          >
            <Button
              size="sm"
              variant={'perps-secondary'}
              className="!p-0 w-full col-span-1 capitalize !text-xs"
              data-selected={(tradeType === _tradeType).toString()}
            >
              {_tradeType}
            </Button>
          </TabsTrigger>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <TabsTrigger
              className="col-span-1 capitalize text-xs w-full"
              value={isProTrade ? tradeType : 'Pro'}
              asChild
            >
              <Button
                size="sm"
                variant={'perps-secondary'}
                className="!p-0 w-full col-span-1 capitalize !text-xs"
                data-selected={isProTrade.toString()}
                asChild
              >
                <div className="flex items-center w-full justify-center">
                  {isProTrade ? tradeType : 'Pro'}
                  <ChevronDownIcon className="w-3 h-3" />
                </div>
              </Button>
            </TabsTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="paper">
            {proTradeType.map((_tradeType) => (
              <DropdownMenuItem key={_tradeType} className="!p-0">
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
