import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Input } from '@sushiswap/ui/future/components/input'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
// import { WalletIcon } from '@sushiswap/ui/future/components/icons'
import { PricePanel } from './PricePanel'
import { BalancePanel } from './BalancePanel'
interface PropType {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  tokenName: string
  imgURL: string
  decimals: number
  coinData: number
  isLoadingPrice: boolean
  setTokenSelectedNumber: React.Dispatch<React.SetStateAction<string>>
  setSwapPerTokenPrice: React.Dispatch<React.SetStateAction<any>>
  tokenNumber: string
  setButtonError: React.Dispatch<React.SetStateAction<string>>
  setToken1Value: React.Dispatch<React.SetStateAction<number>>
  getSwapPrice: (tradeVal: number) => Promise<any>
}
export default function TradeInput({
  setOpen,
  decimals,
  tokenName,
  imgURL,
  coinData,
  isLoadingPrice,
  setTokenSelectedNumber,
  tokenNumber,
  setSwapPerTokenPrice,
  setButtonError,
  getSwapPrice,
  setToken1Value,
}: PropType) {
  const [error, setError] = useState('')
  const { connected } = useWallet()
  const [inputValue, setInputValue] = useState<string>('')
  const tradeVal = useRef<HTMLInputElement>(null)
  const focusInput = useCallback(() => {
    tradeVal.current?.focus()
  }, [])
  useEffect(() => {
    checkBalance()
  }, [coinData])
  console.log(coinData)

  const checkBalance = () => {
    const regexPattern = /^[0-9]*(\.[0-9]*)?$/
    if (regexPattern.test(tradeVal?.current?.value as string)) {
      setInputValue(tradeVal?.current?.value as string)
      setToken1Value(parseFloat(tradeVal?.current?.value as string))
      getSwapPrice(parseFloat(tradeVal?.current?.value as string))
    }
    if (coinData === undefined) {
      coinData = 0
    }

    if (setButtonError) setButtonError('')
    if (connected) {
      const priceEst = coinData / 10 ** decimals < parseFloat(tradeVal?.current?.value as string)
      if (priceEst) {
        setError('Exceeds Balance')
        if (setButtonError) setButtonError('Insufficient Balance')
      } else {
        setError('')
        if (setButtonError) setButtonError('')
      }
    } else {
      setError('')
    }
  }

  const changeToken = () => {
    setOpen(true)
    setTokenSelectedNumber(tokenNumber)
  }

  return (
    <div
      className={`${
        error && '!bg-red-500/20 !dark:bg-red-900/30'
      } space-y-2 overflow-hidden pb-2 p-3 bg-white dark:bg-slate-800 rounded-xl`}
      onClick={focusInput}
    >
      <div className="relative flex items-center gap-4">
        <Input.Numeric
          id="swap-from"
          variant="unstyled"
          value={inputValue}
          ref={tradeVal}
          onUserInput={checkBalance}
          className="text-gray-900 dark:text-slate-50 text-left border-none focus:outline-none focus:ring-0 p-0 bg-transparent w-full truncate font-medium without-ring !text-3xl py-1"
        />
        <button
          onClick={(e) => {
            changeToken()
            e.stopPropagation()
          }}
          id="swap-from-button"
          type="button"
          testdata-id="swap-from-button"
          className="flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap"
        >
          <div className="w-[28px] h-[28px] mr-0.5">
            <img
              src={imgURL}
              alt={tokenName}
              height={28}
              width={28}
              decoding="async"
              loading="lazy"
              data-nimg={1}
              className="rounded-full"
              style={{ color: 'transparent' }}
            />
          </div>
          {tokenName}
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
        <PricePanel isLoading={isLoadingPrice} error={error} />
        <BalancePanel
          coinData={coinData}
          isLoading={isLoadingPrice}
          decimals={decimals}
          onClick={() => {
            setInputValue((coinData / 10 ** 8) as unknown as string)
            const timeOut = setTimeout(() => {
              checkBalance()
            }, 100)
            return () => {
              clearTimeout(timeOut)
            }
          }}
          className="text-blue hover:text-blue-600 active:text-blue-700 hover:dark:text-slate-300"
        />
      </div>
    </div>
  )
}
