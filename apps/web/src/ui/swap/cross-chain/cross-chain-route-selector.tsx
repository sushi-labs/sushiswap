'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
} from '@sushiswap/ui'
import { FC } from 'react'
import { CrossChainRoute as CrossChainRouteType } from 'src/lib/swap/cross-chain/types'
import { CrossChainRoute } from './cross-chain-route'
import { CrossChainRouteLoading } from './cross-chain-route-loading'
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
    state: { routeIndex },
    mutate: { setRouteIndex },
  } = useDerivedStateCrossChainSwap()

  return (
    <div className="w-[640px]">
      <Collapsible open={Boolean(isLoading || routes)}>
        <Card
          variant="outline"
          className="bg-gray-50 dark:bg-slate-800 h-[520px] w-full overflow-hidden flex flex-col"
        >
          <CardHeader>
            <CardTitle>Select A Route</CardTitle>
          </CardHeader>

          <CardContent className="h-full overflow-y-auto">
            {isLoading ? (
              <>
                <CrossChainRouteLoading isSelected={true} />
                {Array.from({ length: 3 }).map((_, index) => (
                  <CrossChainRouteLoading key={`loading-route-${index}`} />
                ))}
              </>
            ) : routes?.length ? (
              routes.map((route, index) => (
                <CrossChainRoute
                  key={`route-${route.id}`}
                  route={route}
                  isSelected={routeIndex === index}
                  onSelect={() => setRouteIndex(index)}
                />
              ))
            ) : null}
          </CardContent>
        </Card>
      </Collapsible>
    </div>
  )
}
