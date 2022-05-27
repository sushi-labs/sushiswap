import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { Price, Type } from '@sushiswap/currency'
import { Dots, Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'

interface Rate {
  loading: boolean
  price: Price<Type, Type> | undefined
}

export const Rate: FC<Rate> = ({ loading, price }) => {
  const [invert, setInvert] = useState(false)

  return (
    <div className="flex justify-between border-t border-slate-700/40">
      <Typography variant="xs" className="cursor-pointer py-3 text-slate-400">
        Rate
      </Typography>
      <Typography
        variant="xs"
        className="cursor-pointer h-[40px] flex items-center hover:text-slate-300 text-slate-400"
      >
        {loading ? (
          <Dots>Fetching best price</Dots>
        ) : price ? (
          <div className="flex gap-1 items-center h-full" onClick={() => setInvert((prevState) => !prevState)}>
            {invert ? (
              <>
                1 {price?.invert().baseCurrency.symbol} = {price?.invert().toSignificant(6)}{' '}
                {price?.invert().quoteCurrency.symbol}
              </>
            ) : (
              <>
                1 {price?.baseCurrency.symbol} = {price?.toSignificant(6)} {price?.quoteCurrency.symbol}
              </>
            )}
            <SwitchHorizontalIcon width={12} height={12} />
          </div>
        ) : (
          'Enter an amount'
        )}
      </Typography>
    </div>
  )
}
