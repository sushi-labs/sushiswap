import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { Price, Type } from '@sushiswap/currency'
import { classNames, Dots, Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { Theme } from '../types'

interface Rate {
  loading: boolean
  price: Price<Type, Type> | undefined
  theme: Theme
}

export const Rate: FC<Rate> = ({ loading, price, theme }) => {
  const [invert, setInvert] = useState(false)

  return (
    <div
      className={classNames(
        theme.secondary.default,
        theme.secondary.hover,
        'flex justify-between border-t border-opacity-40 border-slate-700'
      )}
    >
      <Typography
        variant="xs"
        className={classNames(
          theme.secondary.default,
          theme.secondary.hover,
          'cursor-pointer h-[36px] flex items-center '
        )}
      >
        Rate
      </Typography>
      <Typography
        variant="xs"
        className={classNames(
          theme.secondary.default,
          theme.secondary.hover,
          'cursor-pointer h-[36px] flex items-center '
        )}
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
