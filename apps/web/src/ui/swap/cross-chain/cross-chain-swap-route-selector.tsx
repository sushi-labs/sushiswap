'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cloudinaryFetchLoader,
} from '@sushiswap/ui'
import Image from 'next/image'
import { CrossChainSwapRouteCard } from './cross-chain-swap-route-card'
import {
  useCrossChainTradeRoutes,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapRouteSelector = () => {
  const { data: routes, status } = useCrossChainTradeRoutes()

  const {
    state: { routeOrder, selectedBridge },
    mutate: { setRouteOrder, setSelectedBridge },
  } = useDerivedStateCrossChainSwap()

  return (
    <Card
      variant="outline"
      className="bg-gray-50 dark:bg-slate-800 overflow-hidden flex flex-col max-h-[600px]"
    >
      {status === 'success' && routes?.length > 0 ? (
        <>
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
            {/* {status === 'loading' ? (
                <>
                  <CrossChainRouteCardLoading isSelected={true} />
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CrossChainRouteCardLoading
                      key={`loading-route-${index}`}
                    />
                  ))}
                </>
              ) : routes?.length ? ( */}
            {routes.map((route) => (
              <CrossChainSwapRouteCard
                key={`route-${route.id}`}
                route={route}
                order={routeOrder}
                isSelected={route.steps[0].tool === selectedBridge}
                onSelect={() => setSelectedBridge(route.steps[0].tool)}
              />
            ))}
            {/* ) : null} */}
          </CardContent>
        </>
      ) : status === 'error' || routes?.length === 0 ? (
        <>
          <CardHeader>
            <CardTitle className="!text-xl py-1">Select A Route</CardTitle>
          </CardHeader>
          <CardContent className="items-center">
            <Image
              loader={cloudinaryFetchLoader}
              src="https://cdn.sushi.com/image/upload/v1734105083/SUSHI_404_GRAPHIC.png"
              alt="No Routes Found"
              width={506}
              height={284}
            />
          </CardContent>
          <CardFooter className="text-xl justify-center">
            No Routes Found.
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="!text-2xl text-center">
              SushiXSwap Aggregator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden px-4">
              <div className="flex gap-6 animate-carouselSlide">
                <Image
                  loader={cloudinaryFetchLoader}
                  src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-0.png"
                  alt="sushi"
                  width={95}
                  height={80}
                />
                <Image
                  loader={cloudinaryFetchLoader}
                  src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-1.png"
                  alt="sushi"
                  width={95}
                  height={80}
                />
                <Image
                  loader={cloudinaryFetchLoader}
                  src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-2.png"
                  alt="sushi"
                  width={95}
                  height={80}
                />
                <Image
                  loader={cloudinaryFetchLoader}
                  src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-3.png"
                  alt="sushi"
                  width={95}
                  height={80}
                />
                <Image
                  loader={cloudinaryFetchLoader}
                  src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-4.png"
                  alt="sushi"
                  width={95}
                  height={80}
                />
                <Image
                  loader={cloudinaryFetchLoader}
                  src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-5.png"
                  alt="sushi"
                  width={95}
                  height={80}
                />
                <Image
                  loader={cloudinaryFetchLoader}
                  src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-6.png"
                  alt="sushi"
                  width={95}
                  height={80}
                />
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
}
