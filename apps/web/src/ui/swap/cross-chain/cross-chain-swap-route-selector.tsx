'use client'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useBreakpoint, useMediaQuery } from '@sushiswap/hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cloudinaryFetchLoader,
} from '@sushiswap/ui'
import { QueryStatus } from '@tanstack/react-query'
import Image from 'next/image'
import { FC, useId, useState } from 'react'
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

  const {
    state: { routeOrder, selectedBridge },
    mutate: { setRouteOrder, setSelectedBridge },
  } = useDerivedStateCrossChainSwap()

  const isLg = useMediaQuery({
    query: `(min-width: 1056px)`,
  })
  const { isXl } = useBreakpoint('xl')

  const showDesktopSelector = isSidebarOpen ? isXl : isLg

  return showDesktopSelector ? (
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
      className="bg-gray-50 dark:bg-slate-800 overflow-hidden flex flex-col max-h-[600px] w-full"
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
            <NoRoutesFound />
          </CardContent>
          <CardFooter className="flex-col gap-2 justify-center text-muted-foreground">
            <span className="font-medium">No Routes Found.</span>
            <span className="text-center">
              The problem might be due to high transaction fees, not enough
              liquidity, the amount being too small, or no available routes for
              the combination you selected.
            </span>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="!text-2xl text-center">
              SushiXSwap Aggregator
            </CardTitle>
            <CardDescription className="text-center">
              Swap Anything On Any Chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RouteSelectorMarquee />
          </CardContent>
          <CardFooter className="flex-col gap-3 whitespace-nowrap text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span>✨ Best Pricing</span>
              <span>🍣 Fastest Response Time</span>
            </div>
            <span>‍‍👨‍🍳 Widest Network Coverage</span>
          </CardFooter>
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
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="!gap-5 !pb-7" hideClose>
        <DialogHeader className="!flex-row !space-y-[unset] justify-between">
          <DialogTitle className="!text-xl py-1">Select A Route</DialogTitle>
          <div className="shrink">
            <Select
              value={routeOrder}
              onValueChange={(order: CrossChainRouteOrder) => {
                setRouteOrder(order)
                setDialogOpen(false)
              }}
            >
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

        <div className="flex flex-col gap-6 max-h-[calc(50vh)] overflow-y-auto -mx-6 px-6">
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
            <CardHeader>
              <CardTitle className="!text-xl text-center">
                SushiXSwap Aggregator
              </CardTitle>
              <CardDescription className="text-center">
                Swap Anything On Any Chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RouteSelectorMarquee />
            </CardContent>
            <CardFooter className="flex-col gap-3 whitespace-nowrap text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span>✨ Best Pricing</span>
                <span>🍣 Fastest Response Time</span>
              </div>
              <span>‍‍👨‍🍳 Widest Network Coverage</span>
            </CardFooter>
          </>
        )}
      </Card>
    </Dialog>
  )
}

const SUSHI_IMGS = [
  'https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-0.png',
  'https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-1.png',
  'https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-2.png',
  'https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-3.png',
  'https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-4.png',
  'https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-5.png',
  'https://cdn.sushi.com/image/upload/v1734107194/sushi-plate-6.png',
]

const DUP_SUSHI_IMAGES = [...SUSHI_IMGS, ...SUSHI_IMGS]

const RouteSelectorMarquee = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-6 animate-marquee">
        {DUP_SUSHI_IMAGES.map((img, i) => (
          <Image
            key={`sushi:${i}`}
            loader={cloudinaryFetchLoader}
            src={img}
            alt="sushi"
            width={95}
            height={80}
            quality={100}
          />
        ))}
      </div>
    </div>
  )
}

const NoRoutesFound = () => {
  const id = useId()

  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path={id}>
        <path
          d="M87.75 0C81.018 0 75.5 5.501 75.5 12.216C75.5 14.817 76.33 17.235 77.737 19.222L86.256 33.948C87.449 35.506 88.242 35.21 89.234 33.866L98.629 17.876C98.819 17.533 98.968 17.168 99.097 16.794C99.6947 15.3418 100.001 13.7864 100 12.216C100 5.5 94.484 0 87.75 0ZM87.75 5.724C91.376 5.724 94.26 8.6 94.26 12.216C94.26 15.832 91.376 18.706 87.75 18.706C84.124 18.706 81.24 15.831 81.24 12.216C81.24 8.601 84.125 5.724 87.75 5.724Z"
          fill="#6B7280"
          fill-opacity="0.55"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M88.2095 37.4121C85.9625 37.4621 83.7095 37.5571 81.4525 37.7241L81.8005 43.2561C83.9685 43.0989 86.1402 42.9979 88.3135 42.9531L88.2095 37.4121ZM76.2345 38.2321C72.7645 38.6631 69.2645 39.2771 65.8045 40.2641L67.1075 45.6251C70.2515 44.7291 73.5095 44.1501 76.8185 43.7391L76.2345 38.2321ZM60.6235 42.1201C59.5867 42.5777 58.583 43.1066 57.6195 43.7031L57.6155 43.7081L57.6095 43.7101C56.2345 44.5761 54.7855 45.6751 53.6025 47.2721C52.7455 48.4291 52.0445 49.8921 51.8805 51.6221L56.9755 52.1871C57.0135 51.7811 57.2215 51.2451 57.5955 50.7411H57.5975V50.7391C58.2005 49.9231 59.1045 49.1821 60.1795 48.5041L60.1835 48.5021C60.9503 48.0302 61.7481 47.6105 62.5715 47.2461L60.6235 42.1201ZM58.0005 54.6551L54.6975 58.8901C55.4805 59.6061 56.3015 60.1561 57.0945 60.6161L57.1045 60.6211L57.1145 60.6271C59.7465 62.1241 62.4605 62.9691 64.9765 63.7711L66.4225 58.4531C63.9075 57.6511 61.5365 56.8771 59.5045 55.7231C58.9225 55.3851 58.4125 55.0321 58.0005 54.6551ZM71.3355 59.9491L69.9235 65.2761L70.5915 65.4841L71.4115 65.7461C74.1255 66.6291 76.7255 67.5721 79.0495 68.8771L81.4075 63.9571C78.5975 62.3781 75.6805 61.3461 72.8695 60.4321L72.8615 60.4301L72.0195 60.1611L71.3355 59.9491ZM86.2025 67.6491L82.5795 71.5691C83.4355 72.4961 84.0765 73.6111 84.3885 74.7631L84.3905 74.7691L84.3925 74.7781C84.7645 76.1231 84.7655 77.7051 84.4745 79.3031L89.4985 80.3751C89.9085 78.1191 89.9745 75.6421 89.3005 73.1971C88.7135 71.0351 87.5935 69.1571 86.2025 67.6491ZM82.7205 82.6431C82.1661 83.227 81.5543 83.7537 80.8945 84.2151H80.8925C79.0925 85.4811 77.0045 86.4351 74.7865 87.2551L76.4405 92.4991C78.8665 91.6021 81.3575 90.5021 83.6855 88.8641L83.6915 88.8591L83.6945 88.8571C84.6503 88.1874 85.5346 87.421 86.3335 86.5701L82.7205 82.6431ZM70.0805 88.7321C66.8675 89.5961 63.5835 90.2541 60.2595 90.8121L61.0435 96.2911C64.4645 95.7161 67.8995 95.0291 71.3135 94.1111L70.0805 88.7321ZM55.2585 91.5681C51.9125 92.0251 48.5485 92.3981 45.1745 92.7161L45.6165 98.2381C49.0425 97.9161 52.4745 97.5371 55.9015 97.0681L55.2585 91.5681ZM40.1035 93.1511C36.7225 93.4191 33.3335 93.6371 29.9415 93.8211L30.1975 99.3571C33.6225 99.1721 37.0505 98.9511 40.4775 98.6791L40.1035 93.1511ZM24.8445 94.0711C22.8115 94.1661 20.7735 94.2441 18.7305 94.3161L18.8985 99.8571C20.9542 99.7864 23.0096 99.7044 25.0645 99.6111L24.8445 94.0711Z"
          fill="#6B7280"
          fill-opacity="0.55"
        />
      </g>
      <defs>
        <clipPath id={id}>
          <rect width="100" height="100" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
