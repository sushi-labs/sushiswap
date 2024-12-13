'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import { FC } from 'react'
import { CrossChainRoute as CrossChainRouteType } from 'src/lib/swap/cross-chain/types'
import { CrossChainRouteCard } from './cross-chain-route-card'
import { CrossChainRouteCardLoading } from './cross-chain-route-card-loading'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

interface CrossChainRouteSelectorProps {
  routes: CrossChainRouteType[] | undefined
  isLoading: boolean
}

export const CrossChainRouteSelector: FC<CrossChainRouteSelectorProps> = ({
  routes,
  isLoading,
}) => {
  const {
    state: { routeOrder, selectedBridge },
    mutate: { setRouteOrder, setSelectedBridge },
  } = useDerivedStateCrossChainSwap()

  return (
    <div className="w-[640px]">
      <Collapsible open={Boolean(isLoading || routes)}>
        <Card
          variant="outline"
          className="bg-gray-50 dark:bg-slate-800 h-[520px] w-full overflow-hidden flex flex-col"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="!text-xl py-1">Select A Route</CardTitle>
              <div className="shrink">
                <Select value={routeOrder} onValueChange={setRouteOrder}>
                  <SelectTrigger className="!min-h-[36px] !h-[36px] !border border-black/[0.08] border-dashed">
                    <span className="text-sm">
                      Sort By: <SelectValue />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'CHEAPEST'}>Best Return</SelectItem>
                    <SelectItem value={'FASTEST'}>Fastest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="h-full overflow-y-auto">
            {isLoading ? (
              <>
                <CrossChainRouteCardLoading isSelected={true} />
                {Array.from({ length: 3 }).map((_, index) => (
                  <CrossChainRouteCardLoading key={`loading-route-${index}`} />
                ))}
              </>
            ) : routes?.length ? (
              routes.map((route) => (
                <CrossChainRouteCard
                  key={`route-${route.id}`}
                  route={route}
                  order={routeOrder}
                  isSelected={route.steps[0].tool === selectedBridge}
                  onSelect={() => setSelectedBridge(route.steps[0].tool)}
                />
              ))
            ) : null}
          </CardContent>
        </Card>
      </Collapsible>
    </div>
  )
}
