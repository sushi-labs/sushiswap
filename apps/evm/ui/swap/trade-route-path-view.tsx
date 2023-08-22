'use client'

import { Native, Token, Type } from '@sushiswap/currency'
import { TradeLegType, UseTradeReturn } from '@sushiswap/react-query'
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
import { Currency } from '@sushiswap/ui/components/currency'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'

const tokenFromRToken = (token: TradeLegType['tokenFrom']) => {
  if (token.address === '' || !token.address) return Native.onChain(Number(token.chainId))
  // TODO: move this to api, it should return a number?
  const chainId = token.chainId.toString().startsWith('Bento ')
    ? Number(token.chainId.toString().split(' ')[1])
    : Number(token.chainId)
  return new Token({
    address: token.address,
    symbol: token.symbol,
    chainId,
    decimals: 18,
  })
}

// Can render a tines multi route
export const TradeRoutePathView: FC<{
  trade: UseTradeReturn | undefined
  children: ReactNode
}> = ({ children, trade }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Route</DialogTitle>
          <DialogDescription>
            Our routing system is designed to find the best possible price for your trade. This is done by splitting
            your trade across multiple pools.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="bg-secondary border border-accent rounded-xl">
          <div className="flex flex-col max-h-[300px] divide-y divide-accent">
            {trade?.route?.legs?.map((directPath, i) => (
              <ComplexRoutePath
                key={i}
                fromToken={tokenFromRToken(directPath.tokenFrom)}
                toToken={tokenFromRToken(directPath.tokenTo)}
                poolType={directPath.poolType}
                poolFee={directPath.poolFee}
                portion={directPath.absolutePortion}
                title={`${directPath.poolName}`}
              />
            ))}
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

interface ComplexRoutePathProps {
  fromToken: Type
  toToken: Type
  poolType: 'Stable' | 'Classic' | 'Unknown'
  poolFee: number
  portion: number
  title: string
}

const ComplexRoutePath: FC<ComplexRoutePathProps> = ({ fromToken, toToken, portion, title }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth * Number(portion))
    }
  }, [portion])

  return (
    <div ref={ref} className="p-3 relative grid grid-cols-12 gap-3 items-center">
      <div className="absolute z-[0] inset-0 pointer-events-none bg-secondary" style={{ width }} />
      <div className="z-[1] font-medium col-span-4 text-sm flex items-center gap-2">
        <Currency.Icon disableLink currency={fromToken} width={16} height={16} />
        <span className="truncate">{fromToken.symbol}</span>
      </div>
      <div className="flex flex-col col-span-4">
        <div className="z-[1] col-span-2 text-sm truncate">{Number(portion * 100).toFixed(2)}%</div>
        <div className="z-[1] col-span-4 text-[10px] text-muted-foreground truncate">{title}</div>
      </div>
      <div className="z-[1] font-medium col-span-4 text-sm flex items-center justify-end gap-2">
        <Currency.Icon disableLink currency={toToken} width={16} height={16} />
        <span className="text-sm truncate">{toToken.symbol}</span>
      </div>
    </div>
  )
}
