'use client'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useBreakpoint, useIsMounted, useMediaQuery } from '@sushiswap/hooks'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cloudinaryFetchLoader,
} from '@sushiswap/ui'
import { QueryStatus } from '@tanstack/react-query'
import Image from 'next/image'
import { FC } from 'react'
import { CrossChainRoute, CrossChainRouteOrder } from 'src/lib/swap/cross-chain'
import { useSidebar } from 'src/ui/sidebar'
import { CrossChainSwapRouteCard } from './cross-chain-swap-route-card'
import { CrossChainSwapRouteMobileCard } from './cross-chain-swap-route-mobile-card'
import {
  useCrossChainTradeRoutes,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapRouteSelector = () => {
  const { data: routes, status } = useCrossChainTradeRoutes()
  const { isOpen: isSidebarOpen } = useSidebar()
  const isMounted = useIsMounted()

  const {
    state: { routeOrder, selectedBridge },
    mutate: { setRouteOrder, setSelectedBridge },
  } = useDerivedStateCrossChainSwap()

  const isLg = useMediaQuery({
    query: `(min-width: 1056px)`,
  })
  const { isXl } = useBreakpoint('xl')

  const showDesktopSelector = isSidebarOpen ? isXl : isLg

  return !isMounted ? null : showDesktopSelector ? (
    <DesktopRouteSelector
      routeOrder={routeOrder}
      setRouteOrder={setRouteOrder}
      routes={routes}
      selectedBridge={selectedBridge}
      setSelectedBridge={setSelectedBridge}
      status={status}
    />
  ) : (
    <MobileRouteSelector
      routeOrder={routeOrder}
      setRouteOrder={setRouteOrder}
      routes={routes}
      selectedBridge={selectedBridge}
      setSelectedBridge={setSelectedBridge}
      status={status}
    />
  )
}

interface RouteSelectorProps {
  routeOrder: CrossChainRouteOrder
  setRouteOrder: (order: CrossChainRouteOrder) => void
  selectedBridge: string | undefined
  setSelectedBridge: (bridge: string | undefined) => void
  routes: CrossChainRoute[] | undefined
  status: QueryStatus
}

const DesktopRouteSelector: FC<RouteSelectorProps> = ({
  routeOrder,
  setRouteOrder,
  routes,
  selectedBridge,
  setSelectedBridge,
  status,
}) => {
  return (
    <Card
      variant="outline"
      className="bg-gray-50 dark:bg-slate-800 overflow-hidden flex flex-col max-h-[600px] sm:mt-10 mt-2"
    >
      {status === 'success' && routes && routes.length > 0 ? (
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
            {routes.map((route) => (
              <CrossChainSwapRouteCard
                key={`route-${route.id}`}
                route={route}
                order={routeOrder}
                isSelected={route.steps[0].tool === selectedBridge}
                onSelect={() => setSelectedBridge(route.steps[0].tool)}
              />
            ))}
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
              quality={100}
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
            <RouteSelectorCarousel />
          </CardContent>
        </>
      )}
    </Card>
  )
}

const MobileRouteSelector: FC<RouteSelectorProps> = ({
  routeOrder,
  setRouteOrder,
  routes,
  selectedBridge,
  setSelectedBridge,
  status,
}) => {
  return (
    <Dialog>
      <DialogContent className="!gap-5 !pb-7" hideClose>
        <DialogHeader className="!flex-row !space-y-[unset] justify-between">
          <DialogTitle className="!text-xl py-1">Select A Route</DialogTitle>
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
        </DialogHeader>

        <ScrollArea>
          <div className="flex flex-col gap-6 max-h-[calc(50vh)]">
            {routes?.map((route) => (
              <CrossChainSwapRouteCard
                key={`route-${route.id}`}
                route={route}
                order={routeOrder}
                isSelected={route.steps[0].tool === selectedBridge}
                onSelect={() => setSelectedBridge(route.steps[0].tool)}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>

      <Card
        variant="outline"
        className="w-full bg-gray-50 dark:bg-slate-800 overflow-hidden flex flex-col"
      >
        {status === 'success' && routes && routes.length > 0 ? (
          <>
            <CardHeader className="!px-4 !py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="!text-sm !leading-7 !font-medium">
                  Selected Route
                </CardTitle>
                <DialogTrigger>
                  <span className="flex items-center text-xs leading-7 font-semibold text-blue hover:text-blue-700">
                    View All ({routes.length})
                    <ChevronRightIcon strokeWidth={2} width={14} height={14} />
                  </span>
                </DialogTrigger>
              </div>
            </CardHeader>
            <CardContent>
              <CrossChainSwapRouteMobileCard
                route={routes?.find(
                  (route) => route.steps[0].tool === selectedBridge,
                )}
                order={routeOrder}
                isSelected={true}
              />
            </CardContent>
          </>
        ) : status === 'error' || routes?.length === 0 ? (
          <>
            <CardHeader className="!px-4 !py-3">
              <CardTitle className="!text-sm !leading-7 !font-medium">
                Selected Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center text-muted-foreground">
                No Routes Found.
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="!px-4 !py-3">
              <CardTitle className="!text-sm !leading-7 !font-medium">
                SushiXSwap Aggregator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RouteSelectorCarousel />
            </CardContent>
          </>
        )}
      </Card>
    </Dialog>
  )
}

const RouteSelectorCarousel = () => {
  return (
    <div className="relative overflow-hidden px-4">
      <div className="flex gap-6 animate-carouselSlide">
        <Image
          loader={cloudinaryFetchLoader}
          src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-0.png"
          alt="sushi"
          width={95}
          height={80}
          quality={100}
        />
        <Image
          loader={cloudinaryFetchLoader}
          src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-1.png"
          alt="sushi"
          width={95}
          height={80}
          quality={100}
        />
        <Image
          loader={cloudinaryFetchLoader}
          src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-2.png"
          alt="sushi"
          width={95}
          height={80}
          quality={100}
        />
        <Image
          loader={cloudinaryFetchLoader}
          src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-3.png"
          alt="sushi"
          width={95}
          height={80}
          quality={100}
        />
        <Image
          loader={cloudinaryFetchLoader}
          src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-4.png"
          alt="sushi"
          width={95}
          height={80}
          quality={100}
        />
        <Image
          loader={cloudinaryFetchLoader}
          src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-5.png"
          alt="sushi"
          width={95}
          height={80}
          quality={100}
        />
        <Image
          loader={cloudinaryFetchLoader}
          src="https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-6.png"
          alt="sushi"
          width={95}
          height={80}
          quality={100}
        />
      </div>
    </div>
  )
}
