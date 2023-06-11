import { Native, Token, Type } from '@sushiswap/currency'
import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { TradeLegType, UseTradeReturn } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Dialog } from '@sushiswap/ui/future/components/dialog'

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
export const TradeRoute: FC<{
  trade: UseTradeReturn | undefined
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ open, setOpen, trade }) => {
  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Content className="max-h-[320px] sm:max-h-[560px] overflow-y-scroll scroll dark:!bg-slate-800 bg-white">
        <div className="flex flex-col gap-4">
          <Dialog.Header title="Optimized route" />
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
      </Dialog.Content>
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
      setWidth((ref.current.offsetWidth - 28) * Number(portion))
    }
  }, [portion])

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-12 gap-3 rounded-full border-gray-200 dark:border-black/[0.12] bg-gray-200 dark:bg-black/[0.12] border-2 p-2"
    >
      <div
        className="absolute z-[0] inset-0 rounded-full pointer-events-none bg-white dark:bg-slate-700/[0.6]"
        style={{ width: `calc(24px + ${width}px)` }}
      />
      <div className="z-[1] col-span-3 text-xs font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-2">
        <Currency.Icon disableLink currency={fromToken} width={16} height={16} />
        <span className="truncate">{fromToken.symbol}</span>
      </div>
      <div className="z-[1] col-span-2 text-xs font-semibold text-gray-500 dark:text-slate-500 truncate text-right">
        {Number(portion * 100).toFixed(2)}%
      </div>
      <div className="z-[1] col-span-4 text-xs font-semibold text-gray-900 dark:text-slate-200 truncate">{title}</div>
      <div className="z-[1] col-span-3 text-xs font-semibold text-gray-900 dark:text-slate-200 flex items-center justify-end gap-2">
        <Currency.Icon disableLink currency={toToken} width={16} height={16} />
        <span className="text-xs font-semibold text-gray-900 dark:text-slate-200 truncate">{toToken.symbol}</span>
      </div>
    </div>
  )
}
