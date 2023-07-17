import { Typography, classNames } from '@sushiswap/ui'
import { FC, ReactElement, ReactNode, useCallback, useState } from 'react'
import { usePoolState } from './PoolProvider'

interface RenderPayload {
  invert: boolean
  toggleInvert(): void
  content: ReactElement
  usdPrice?: string
}

interface Rate {
  children?: (payload: RenderPayload) => ReactNode
}

export const Rate: FC<Rate> = ({ children }) => {
  const { token0, token1, amount0, amount1, isPriceFetching } = usePoolState()
  const [invert, setInvert] = useState(false)
  // const { data: prices } = usePrices({})
  // const usdPrice = price
  //   ? prices?.[invert ? price.quoteCurrency.wrapped.address : price.baseCurrency.wrapped.address]?.toFixed(2)
  //   : undefined

  const content = (
    <>
      {invert ? (
        <>
          1 {token1?.symbol} = {amount1} {token0?.symbol}
        </>
      ) : (
        <>
          1 {token0?.symbol} = {amount1} {token1?.symbol}
        </>
      )}
    </>
  )

  const toggleInvert = useCallback(() => {
    setInvert((prevState) => !prevState)
  }, [])

  if (typeof children === 'function') {
    return <>{children({ invert, toggleInvert, content })}</>
  }

  return (
    <div
      className={classNames(
        'text-slate-300 hover:text-slate-200 flex justify-between border-t border-opacity-40 border-slate-700'
      )}
    >
      <Typography variant="xs" className={classNames('cursor-pointer h-[36px] flex items-center gap-1')}>
        Rate
      </Typography>
      {/* <Typography variant="xs" className={classNames('cursor-pointer h-[36px] flex items-center ')}>
        {price ? (
          <div className="flex items-center h-full gap-1 font-medium" onClick={toggleInvert}>
            {content} <span className="text-slate-500">(${usdPrice})</span>
          </div>
        ) : (
          'Enter an amount'
        )}
      </Typography> */}
    </div>
  )
}
