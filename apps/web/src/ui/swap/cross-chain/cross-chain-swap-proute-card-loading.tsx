import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { FC } from 'react'

interface CrossChainSwapRouteCardLoadingProps {
  isSelected?: boolean
}

export const CrossChainSwapRouteCardLoading: FC<
  CrossChainSwapRouteCardLoadingProps
> = () => {
  return (
    <Card
      variant="outline"
      className="cursor-pointer bg-white dark:!bg-black/[0.04] hover:opacity-80"
    >
      <CardHeader>
        <CardTitle>
          <div className="h-[18px] w-32">
            <SkeletonText />
          </div>
        </CardTitle>
        <CardDescription>
          <div className="h-5 w-24">
            <SkeletonText />
          </div>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex justify-between items-center w-full text-sm font-semibold">
          <div className="h-[22px] w-60">
            <SkeletonText />
          </div>

          <div className="h-5 w-56">
            <SkeletonText />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
