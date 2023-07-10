import React, { useEffect } from 'react'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { Input } from '@sushiswap/ui/future/components/input'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { PricePanel } from './PricePanel'
import { BalancePanel } from './BalancePanel'
import { formatNumber } from 'utils/utilFunctions'
import { Token } from 'utils/tokenType'
interface PropType {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  currency: Token
  coinData: number
  isLoadingPrice: boolean
  setTokenSelectedNumber: React.Dispatch<React.SetStateAction<string>>
  tokenNumber: string
  outpuSwapTokenAmount: any
  isLoadingPriceLower: boolean
}
export default function TradeOutput({
  setOpen,
  currency,
  coinData,
  isLoadingPrice,
  setTokenSelectedNumber,
  tokenNumber,
  outpuSwapTokenAmount,
  isLoadingPriceLower,
}: PropType) {
  outpuSwapTokenAmount = outpuSwapTokenAmount?.amountOut
    ? formatNumber(outpuSwapTokenAmount.amountOut, currency.decimals)
    : ''
  useEffect(() => {
    checkBalance()
  }, [coinData])

  const checkBalance = () => {
    if (coinData === undefined) {
      coinData = 0
    }
  }

  const changeToken = () => {
    setOpen(true)
    setTokenSelectedNumber(tokenNumber)
  }

  return (
    <div className={`space-y-2 overflow-hidden pb-2 p-3 bg-white dark:bg-slate-800 rounded-xl`}>
      <div className="relative flex items-center gap-4">
        {isLoadingPriceLower ? (
          <div className="w-full flex items-center">
            <div className="w-[170px]">
              <Skeleton.Text fontSize="text-2xl" className="w-full" />
            </div>
          </div>
        ) : (
          <Input.Numeric
            id="swap-to"
            variant="unstyled"
            disabled={true}
            value={outpuSwapTokenAmount ? outpuSwapTokenAmount : ''}
            className="text-gray-900 dark:text-slate-50 text-left border-none focus:outline-none focus:ring-0 p-0 bg-transparent w-full truncate font-medium without-ring !text-3xl py-1"
          />
        )}

        <button
          onClick={changeToken}
          id="swap-from-button"
          type="button"
          testdata-id="swap-from-button"
          className="flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap"
        >
          <div className="w-[28px] h-[28px] mr-0.5">
            <img
              alt="Ether"
              loading="lazy"
              width={28}
              height={28}
              decoding="async"
              data-nimg={1}
              className="rounded-full"
              src={currency.logoURI}
              style={{ color: 'transparent' }}
            />
          </div>
          {currency.name}
          <ChevronDownIcon className="ml-1" strokeWidth={3} width={16} height={16} />
        </button>
        <div
          style={{
            position: 'fixed',
            top: '1px',
            left: '1px',
            width: '1px',
            height: '0px',
            padding: '0px',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0px, 0px, 0px, 0px)',
            whiteSpace: 'nowrap',
            borderWidth: '0px',
            display: 'none',
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-between h-[36px]">
        <PricePanel isLoading={isLoadingPrice} />
        <BalancePanel
          coinData={coinData}
          isLoading={isLoadingPrice}
          isLoadingLower={isLoadingPriceLower}
          decimals={currency.decimals}
          disabled={true}
          className="text-gray-500 dark:text-slate-500"
        />
      </div>
    </div>
  )
}
