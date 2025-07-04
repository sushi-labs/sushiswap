'use client'

import { Button, classNames } from '@sushiswap/ui'
import {
  type FC,
  type ReactElement,
  type ReactNode,
  useCallback,
  useState,
} from 'react'
import type { Price } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'

interface RenderPayload {
  invert: boolean
  toggleInvert(): void
  content: ReactElement<any>
  usdPrice?: string
}

interface Rate {
  price: Price<EvmCurrency, EvmCurrency> | undefined
  children?: (payload: RenderPayload) => ReactNode
}

export const Rate: FC<Rate> = ({ children, price }) => {
  const [invert, setInvert] = useState(false)
  const { data: prices } = usePrices({
    chainId: invert ? price?.quote.chainId : price?.base.chainId,
  })
  const usdPrice = price
    ? prices
        ?.get(invert ? price.quote.wrap().address : price.base.wrap().address)
        ?.toFixed(2)
    : undefined

  const content = (
    <>
      {invert ? (
        <>
          1 {price?.invert().base.symbol} = {price?.invert().toSignificant(6)}{' '}
          {price?.invert().quote.symbol}
        </>
      ) : (
        <>
          1 {price?.base.symbol} = {price?.toSignificant(6)}{' '}
          {price?.quote.symbol}
        </>
      )}
    </>
  )

  const toggleInvert = useCallback(() => {
    setInvert((prevState) => !prevState)
  }, [])

  if (typeof children === 'function') {
    return <>{children({ invert, toggleInvert, content, usdPrice })}</>
  }

  return (
    <div
      className={classNames(
        'text-slate-300 hover:text-slate-200 flex justify-between border-t border-opacity-40 border-slate-700',
      )}
    >
      <p
        className={classNames(
          'text-xs cursor-pointer h-[36px] flex items-center gap-1',
        )}
      >
        Rate
      </p>
      <p
        className={classNames(
          'text-xs cursor-pointer h-[36px] flex items-center ',
        )}
      >
        {price ? (
          <Button
            type="button"
            variant="link"
            className="flex items-center h-full gap-1 font-medium"
            onClick={toggleInvert}
            onKeyDown={toggleInvert}
          >
            {content} <span className="text-slate-500">(${usdPrice})</span>
          </Button>
        ) : (
          'Enter an amount'
        )}
      </p>
    </div>
  )
}
