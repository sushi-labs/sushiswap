'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'
import {
  Currency,
  IconButton,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  TextField,
  Toggle,
  classNames,
} from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { Amount, Price, Type } from 'sushi/currency'
import { parseUnits } from 'viem/utils'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

const PRICE_OPTIONS = [
  {
    label: 'Market',
    value: 0,
  },
  {
    label: '+1%',
    value: 1,
  },
  {
    label: '+5%',
    value: 5,
  },
  {
    label: '+10%',
    value: 10,
  },
]

type PriceOption = (typeof PRICE_OPTIONS)[number]

{
  /* <Web3Input.Currency
id="swap-from"
type="INPUT"
className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
chainId={chainId}
onSelect={setToken1}
value={swapAmountString}
onChange={setSwapAmount}
currency={token1}
loading={isLoading}
currencyLoading={isLoading}
allowNative={isWNativeSupported(chainId)}
label="You're buying"
/> */
}

// interface LimitOrderPriceInputProps {
//   error?: string
//   hidePinnedTokens?: boolean
//   disableInsufficientBalanceError?: boolean
//   hideSearch?: boolean
//   hidePricing?: boolean
//   hideIcon?: boolean
//   label?: string
//   networks?: readonly ChainId[]
//   selectedNetwork?: ChainId
//   onNetworkChange?: (network: number) => void
// }

const applyPriceOption = (price: Price<Type, Type>, { value }: PriceOption) => {
  const oneUnitOfBaseCurrency = Amount.fromRawAmount(
    price.baseCurrency,
    parseUnits('1', price.baseCurrency.decimals),
  )
  return price.quote(oneUnitOfBaseCurrency)
}

// const applyPriceOption = (price: string, { value }: PriceOption) => {
//   return (+price * (1 + value / 100))
// }

export const LimitPriceInput = () => {
  const {
    state: { token0, token1, marketPrice, limitPrice },
    mutate: { switchTokens, setLimitPrice },
    isToken0Loading,
    isLoading,
  } = useDerivedStateTwap()

  const ADJUSTED_PRICES = useMemo(() => {
    if (!marketPrice) return undefined

    const oneUnitOfBaseCurrency = Amount.fromRawAmount(
      marketPrice.baseCurrency,
      parseUnits('1', marketPrice.baseCurrency.decimals),
    )

    const getAdjustedPrice = (priceAdjustmentPercentage: number) => {
      if (priceAdjustmentPercentage === 0) return marketPrice
      return new Price({
        // 100 input token
        baseAmount: Amount.fromRawAmount(
          marketPrice.baseCurrency,
          parseUnits('100', marketPrice.baseCurrency.decimals),
        ),
        // (100 + adjustmentPercentage) times the market quote amount for 1 input token
        quoteAmount: Amount.fromRawAmount(
          marketPrice.quoteCurrency,

          BigInt(100 + priceAdjustmentPercentage) *
            marketPrice.quote(oneUnitOfBaseCurrency).quotient,
        ),
      })
    }

    return PRICE_OPTIONS.map(({ value }) => getAdjustedPrice(value))
  }, [marketPrice])

  const [priceOptionIndex, setPriceOptionIndex] = useState<number>(0)

  useEffect(() => {
    if (ADJUSTED_PRICES?.length) {
      setLimitPrice(ADJUSTED_PRICES[priceOptionIndex])
    }
  }, [ADJUSTED_PRICES, priceOptionIndex, setLimitPrice])

  return (
    <div
      className={classNames(
        // error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'relative overflow-hidden border border-accent bg-white dark:bg-slate-800 rounded-xl',
      )}
    >
      <div className="flex justify-between items-center border-b border-accent p-3">
        <div className="flex items-center gap-2 whitespace-nowrap text-xs">
          <span className="font-medium">When 1</span>
          {token0 ? (
            <>
              <Currency.Icon currency={token0} width={16} height={16} />
              <span className="font-medium">{token0.name}</span>
            </>
          ) : (
            <>
              <SkeletonCircle radius={16} />
              <span className="w-8">
                <SkeletonText fontSize="xs" />
              </span>
            </>
          )}
          <span className="text-muted-foreground">is worth</span>
        </div>
        <IconButton
          icon={ArrowsUpDownIcon}
          onClick={switchTokens}
          name={'Switch tokens'}
          className="!min-h-[30px] !h-[30px] !min-w-[30px] !w-[30px] px-2"
        />
      </div>
      <div className="flex flex-col gap-2 px-3 py-2">
        <div className="flex items-center gap-4">
          <div
            data-state={isLoading ? 'active' : 'inactive'}
            className={classNames(
              'data-[state=inactive]:hidden data-[state=active]:flex',
              'gap-4 items-center justify-between flex-grow h-[40px]',
            )}
          >
            <SkeletonBox className="w-2/3 h-[32px] rounded-lg" />
            {isToken0Loading ? (
              <SkeletonBox className="w-1/3 h-[32px] rounded-lg" />
            ) : null}
          </div>
          <div
            data-state={isLoading ? 'inactive' : 'active'}
            className="data-[state=inactive]:hidden data-[state=active]:flex flex-1 items-center"
          >
            <TextField
              type="number"
              variant="naked"
              // onValueChange={_onChange}
              // value={pending ? localValue : value}
              // readOnly={disabled}
              // onValueChange={setLimitPrice}
              value={limitPrice?.toSignificant() ?? ''}
              maxDecimals={token0?.decimals}
              data-state={isLoading ? 'inactive' : 'active'}
              className={classNames('p-0 py-1 !text-3xl font-medium')}
            />
          </div>
          {token0 ? (
            <div className="flex items-center gap-1">
              <Currency.Icon
                disableLink
                currency={token0}
                width={20}
                height={20}
              />
              <span className="font-medium">{token0.symbol}</span>
            </div>
          ) : null}

          {/* {selector} */}
          {/* {!onSelect ? (
          <div
            id={`${id}-button`}
            className={classNames(
              'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium whitespace-nowrap',
            )}
          >
            {currency ? (
              <>
                {!hideIcon && (
                  <>
                    <div className="w-[28px] h-[28px] mr-0.5">
                      <Currency.Icon
                        disableLink
                        currency={currency}
                        width={28}
                        height={28}
                      />
                    </div>
                  </>
                )}
                {currency.symbol}
              </>
            ) : (
              <span className="text-gray-400 dark:text-slate-500">
                No token selected
              </span>
            )}
          </div>
        ) : null} */}
        </div>

        {/* TODO: HANDLE CUSTOM INPUT */}

        <RadioGroup
          value={priceOptionIndex}
          className="gap-2 flex flex-wrap py-1"
        >
          {PRICE_OPTIONS.map((option, idx) => (
            <Radio value={option.value} key={option.value}>
              <Toggle
                disabled={isLoading}
                variant="outline"
                className="whitespace-nowrap !rounded-[50px] !px-4 !h-7"
                onClick={() => setPriceOptionIndex(idx)}
                pressed={priceOptionIndex === idx}
              >
                {option.label}
              </Toggle>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  )

  // return (
  //   <Card>
  //     <CardHeader>
  //       <CardTitle>
  //         <CardHeader className="!flex-row justify-between items-center">
  //           <div className="flex flex-row items-center gap-2">
  //             <span>When 1</span>
  //             {token0 ? (
  //               <>
  //                 <Currency.Icon currency={token0} width={16} height={16} />
  //                 <span>{token0.name}</span>
  //               </>
  //             ) : (
  //               <>
  //                 <SkeletonCircle radius={16} />
  //                 <SkeletonText />
  //               </>
  //             )}
  //             <span>is worth</span>
  //           </div>
  //           <IconButton
  //             icon={ArrowsUpDownIcon}
  //             onClick={switchTokens}
  //             name={'Switch tokens'}
  //           />
  //         </CardHeader>
  //       </CardTitle>
  //     </CardHeader>
  //     {/* <CardContent></CardContent> */}
  //     <CardFooter></CardFooter>
  //   </Card>
  // )
}
