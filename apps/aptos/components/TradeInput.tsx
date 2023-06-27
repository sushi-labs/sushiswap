import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { helloCLG } from 'utils/utilFunctions'
interface PropType {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  tokenName: string
  imgURL: string
  decimals: number
  coinData?: number
  isLoadingPrice?: boolean
  setTokenSelectedNumber: React.Dispatch<React.SetStateAction<string>>
  tokenNumber: string
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
}: PropType) {
  const [error, setError] = useState('')
  const { connected } = useWallet()
  // const [tradeVal, setTradeVal] = useState<number>()
  const tradeVal = useRef<HTMLInputElement>(null)
  let [big, portion] = (coinData ? `${coinData / 10 ** decimals}` : '0.00').split('.')
  portion = portion ? portion.substring(0, 2) : '00'
  useEffect(() => {
    checkBalance()
  }, [coinData])

  const checkBalance = () => {
    if (coinData === undefined) {
      coinData = 0
    }
    if (tradeVal?.current?.value && connected) {
      const priceEst = coinData / 10 ** 8 < parseFloat(tradeVal?.current?.value)
      console.log()
      priceEst ? setError('Exceed Balance') : setError('')
    } else {
      setError('')
    }
  }

  const changeToken = () => {
    setOpen(true)
    setTokenSelectedNumber(tokenNumber)
  }

  return (
    <div className="space-y-2 overflow-hidden pb-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
      <div className="relative flex items-center gap-4">
        <input
          testdata-id="swap-from-input"
          inputMode="decimal"
          title="Token Amount"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="new-password"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder="0"
          min={0}
          ref={tradeVal}
          onChange={() => {
            checkBalance()
            helloCLG('yash')
          }}
          minLength={1}
          maxLength={79}
          className="text-gray-900 dark:text-slate-50 text-left text-base font-medium border-none focus:outline-none focus:ring-0 p-0 bg-transparent w-full truncate font-medium without-ring !text-3xl py-1"
          type="text"
        />
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
              src={imgURL}
              style={{ color: 'transparent' }}
            />
          </div>
          {tokenName}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            aria-hidden="true"
            className="ml-1"
            width={16}
            height={16}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
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
        {error ? (
          error
        ) : (
          <p className="font-medium text-lg flex items-baseline select-none text-gray-500 dark:text-slate-400">
            $ 0.<span className="text-sm font-semibold">00</span>
          </p>
        )}

        <button
          id="swap-from-balance-button"
          testdata-id="swap-from-balance-button"
          type="button"
          className="text-blue hover:text-blue-600 active:text-blue-700 hover:dark:text-slate-300 font-medium flex gap-1.5 items-center py-1 dark:text-slate-400 px-2 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" width={18} height={18}>
            <path
              fill="currentColor"
              d="M15.6 4.6H1.85v-.55l12.1-.968v.968h1.65V2.4c0-1.21-.98-2.059-2.177-1.888L2.378 2.089C1.18 2.26.2 3.39.2 4.6v11a2.2 2.2 0 002.2 2.2h13.2a2.2 2.2 0 002.2-2.2V6.8a2.2 2.2 0 00-2.2-2.2zm-1.65 7.707a1.65 1.65 0 01-.63-3.176 1.65 1.65 0 11.63 3.176z"
            />
          </svg>
          {isLoadingPrice ? (
            <div className="w-[60px] flex items-center">
              <Skeleton.Text fontSize="text-lg" className="w-full" />
            </div>
          ) : (
            <span className="text-lg">
              {big}.<span className="text-sm font-semibold">{portion}</span>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
