'use client'

import { classNames } from '@sushiswap/ui'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useEffect, useState } from 'react'
import type { Amount, Type } from 'sushi/currency'
import type { Address } from 'viem'
import {
  TransferState,
  useTransferToken,
} from '../../hooks/transfer/hooks/use-transfer-token'

interface TransferTokenProps extends ButtonProps {
  id: string
  amount: Amount<Type> | undefined
  sendTo: Address | undefined
  enabled?: boolean
  onSuccess?: () => void
}

const TransferToken: FC<TransferTokenProps> = ({
  id,
  amount,
  sendTo,
  children,
  className,
  fullWidth = true,
  size = 'xl',
  enabled = true,
  onSuccess,
  ...props
}) => {
  const [isTransferred, setIsTransferred] = useState(false)
  const [state, { write }] = useTransferToken({
    amount,
    sendTo,
    enabled,
  })

  useEffect(() => {
    if (state === TransferState.TRANSFERED) {
      setIsTransferred(true)
      onSuccess?.()
    }
  }, [state, onSuccess])

  if (isTransferred || state === TransferState.TRANSFERED || !enabled) {
    return <>{children}</>
  }

  const loading = [TransferState.UNKNOWN, TransferState.PENDING].includes(state)

  return (
    <Button
      disabled={state !== TransferState.NOT_TRANSFERED || !write}
      className={classNames(className, 'relative group')}
      loading={loading}
      onClick={() => write?.()}
      fullWidth={fullWidth}
      size={size}
      testId={id}
      {...props}
    >
      {loading ? 'Sending' : 'Send'} {amount?.currency.symbol}
    </Button>
  )
}

export { TransferToken, type TransferTokenProps }
