'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useEffect, useState } from 'react'
import { Percent } from 'sushi/math'

const SLIPPAGE_WARNING_THRESHOLD = new Percent(1, 5) // 20%

type SlippageProps = ButtonProps & {
  text: string
  slippageTolerance: Percent
}

const Slippage: FC<SlippageProps> = ({
  text,
  slippageTolerance,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const [open, setOpen] = useState(
    () => !slippageTolerance.lessThan(SLIPPAGE_WARNING_THRESHOLD),
  )

  useEffect(() => {
    if (!open && !slippageTolerance.lessThan(SLIPPAGE_WARNING_THRESHOLD)) {
      setOpen(true)
    }
  }, [open, slippageTolerance])

  return open ? (
    <Button
      id="slippage-checker"
      fullWidth={fullWidth}
      size={size}
      variant="destructive"
      onClick={() => setOpen(false)}
      {...props}
    >
      {text}
    </Button>
  ) : (
    <>{children}</>
  )
}

export { Slippage, type SlippageProps, SLIPPAGE_WARNING_THRESHOLD }
