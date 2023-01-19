import { FC, ReactNode, useCallback } from 'react'
import { useSwapState } from './trade/TradeProvider'

interface ConfirmationDialogCrossChainProps {
  children({
    onClick,
    isWritePending,
  }: {
    onClick(): void
    isWritePending: boolean
    isLoading: boolean
    isConfirming: boolean
  }): ReactNode
}

export const ConfirmationDialogCrossChain: FC<ConfirmationDialogCrossChainProps> = ({ children }) => {
  const { network0, network1 } = useSwapState()
  const enabled = network0 !== network1
  const onClick = useCallback(() => {}, [])
  const isWritePending = false
  const isLoading = false
  const isConfirming = false

  return (
    <>
      {children({
        onClick,
        isWritePending,
        isLoading,
        isConfirming,
      })}
      <span />
    </>
  )
}
