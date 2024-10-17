import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@sushiswap/ui'
import React, { FC, ReactNode, useMemo } from 'react'
import { useBaseTokens } from '~aptos/_common/lib/common/use-base-tokens'
import { useTokenWithCache } from '~aptos/_common/lib/common/use-token-with-cache'
import { CurrencyIcon } from '~aptos/_common/ui/currency/currency-icon'

interface SwapRoute {
  trade: string[]
  children: ReactNode
}

export const TradeRoutePathView: FC<SwapRoute> = ({ trade, children }) => {
  const rows = useMemo(() => {
    const rows: JSX.Element[] = []
    for (let i = 0; i < trade.length - 1; i++) {
      rows.push(
        <ComplexRoutePath
          key={i}
          fromTokenAddress={trade[i]}
          toTokenAddress={trade[i + 1]}
        />,
      )
    }
    return rows
  }, [trade])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Route</DialogTitle>
          <DialogDescription>
            Our routing system automatically splits your trade across various
            pools to get you the best price.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="bg-secondary border border-accent rounded-xl">
          <div className="flex flex-col max-h-[300px] divide-y divide-accent">
            {rows}
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose className="w-full">
            <Button fullWidth size="xl">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ComplexRoutePath {
  fromTokenAddress: string
  toTokenAddress: string
}

const ComplexRoutePath = ({
  fromTokenAddress,
  toTokenAddress,
}: ComplexRoutePath) => {
  const { data: tokens } = useBaseTokens()

  const { data: queryToken0 } = useTokenWithCache({ address: fromTokenAddress })
  const { data: queryToken1 } = useTokenWithCache({ address: toTokenAddress })

  const fromToken = useMemo(() => {
    if (tokens?.[fromTokenAddress]) {
      return tokens[fromTokenAddress]
    }

    return queryToken0
  }, [tokens, fromTokenAddress, queryToken0])

  const toToken = useMemo(() => {
    if (tokens?.[toTokenAddress]) {
      return tokens[toTokenAddress]
    }

    return queryToken1
  }, [tokens, toTokenAddress, queryToken1])

  return (
    <div className="p-3 relative grid grid-cols-12 gap-3 items-center">
      <div className="absolute z-[0] inset-0 pointer-events-none bg-secondary w-full" />
      <div className="z-[1] font-medium col-span-4 text-sm flex items-center gap-2">
        <CurrencyIcon currency={fromToken} width={16} height={16} />
        <span className="truncate">{fromToken?.symbol}</span>
      </div>
      <div className="z-[1] col-span-2 text-sm truncate">100.00%</div>
      <div className="z-[1] font-medium col-span-4 text-sm flex items-center justify-end gap-2">
        <CurrencyIcon currency={toToken} width={16} height={16} />
        <span className="text-sm truncate">{toToken?.symbol}</span>
      </div>
    </div>
  )
}
