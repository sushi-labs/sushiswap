import { Currency, Token } from '@sushiswap/core-sdk'
import React, { FC } from 'react'

import Typography from '../Typography'
import CurrencyLogo, { CurrencyLogoProps } from './CurrencyLogo'

interface CurrencyLogosProps extends Omit<CurrencyLogoProps, 'currency' | 'size'> {
  currencies: (Currency | Token)[]
  dense?: boolean
  maxLogos?: number
  size?: number
}

const CurrencyLogoArray: FC<CurrencyLogosProps> = ({ currencies, dense = false, maxLogos = 3, size = 24, ...rest }) => {
  const logos =
    currencies.length <= maxLogos
      ? currencies
      : currencies.slice(0, Math.max(0, Math.min(currencies.length, maxLogos) - 1))
  const remnant = currencies.length - logos.length

  return (
    <div className="flex">
      {logos.map((currency, index) => {
        return (
          <div
            className="overflow-hidden rounded-full"
            key={index}
            style={{
              marginLeft: maxLogos > 1 ? (index === 0 ? '' : dense ? -Math.floor(size / 2 - 4) : -6) : 0,
              filter: 'drop-shadow(0px 3px 6px rgba(15, 15, 15, 0.25))',
            }}
          >
            <CurrencyLogo currency={currency} size={size} {...rest} />
          </div>
        )
      }, [])}
      {remnant > 0 && (
        <div
          className="rounded-full overflow-hidden flex items-center justify-center z-[1]"
          style={{
            marginLeft: maxLogos > 1 ? (dense ? -Math.floor(size / 2 + 2) : -6) : 0,
            width: size,
            height: size,
            background: 'radial-gradient(50% 50% at 50% 50%, #FFFFFF 0%, #DBDBDB 100%)',
            filter: 'drop-shadow(0px 3px 6px rgba(15, 15, 15, 0.25))',
          }}
        >
          <Typography weight={700} className="text-low-emphesis" variant="sm">
            +{currencies.length - maxLogos + 1}
          </Typography>
        </div>
      )}
    </div>
  )
}

export default CurrencyLogoArray
