'use client'

import type { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Button, type ButtonProps } from '@sushiswap/ui'
import type { FC } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Percent } from 'sushi/math'

const MAX_SLIPPAGE = new Percent(1, 5) // 20%

type SlippageProps = ButtonProps & {
  text: string
  storageKey?: SlippageToleranceStorageKey
}

const Slippage: FC<SlippageProps> = ({
  text,
  storageKey,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const [slippageTolerance] = useSlippageTolerance(storageKey)

  return !slippageTolerance.lessThan(MAX_SLIPPAGE) ? (
    <Button
      id="slippage-checker"
      disabled={true}
      fullWidth={fullWidth}
      size={size}
      variant="destructive"
      {...props}
    >
      {text}
    </Button>
  ) : (
    <>{children}</>
  )
}

export { Slippage, type SlippageProps }
