import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { Button, Dots } from '@sushiswap/ui'
import { getSushiSwapRouterContractConfig, PairState } from '@sushiswap/wagmi'
import { Approve2 } from '@sushiswap/wagmi/systems/Approve2'
import { ApprovalType, ApproveDefinition } from '@sushiswap/wagmi/systems/Approve2/types'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { useNotifications } from '../../../lib/state/storage'
import { AddSectionReviewModal } from '../AddSectionReviewModal'
import { ExecuteProvider } from './ExecuteProvider'

export interface AddSectionReviewModalLegacyProps {
  poolState: PairState
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children({ setOpen }: { setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalLegacy: FC<AddSectionReviewModalLegacyProps> = ({
  poolState,
  chainId,
  token0,
  token1,
  input0,
  input1,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

  const definition = useMemo(() => {
    const definition: ApproveDefinition = [
      {
        type: ApprovalType.Token,
        amount: input0,
        address: getSushiSwapRouterContractConfig(chainId).address,
        buttonProps: {
          fullWidth: true,
          className: 'whitespace-nowrap',
          size: 'md',
          id: 'add-liquidity-legacy-approve-token0',
        },
      },
      {
        type: ApprovalType.Token,
        amount: input1,
        address: getSushiSwapRouterContractConfig(chainId).address,
        buttonProps: {
          fullWidth: true,
          className: 'whitespace-nowrap',
          size: 'md',
          id: 'add-liquidity-legacy-approve-token1',
        },
      },
    ]

    return definition
  }, [chainId, input0, input1])

  const onSuccess = useCallback(() => {
    setOpen(false)
  }, [])

  return useMemo(
    () => (
      <>
        {children({ setOpen })}
        <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
          <Approve2.Root chainId={chainId} onSuccess={createNotification} definition={definition}>
            <ExecuteProvider
              onSuccess={onSuccess}
              poolState={poolState}
              chainId={chainId}
              token0={token0}
              token1={token1}
              input0={input0}
              input1={input1}
            >
              {({ isWritePending, execute }) => {
                return (
                  <Button
                    size="md"
                    testdata-id="add-legacy-review-confirm-button"
                    disabled={isWritePending}
                    fullWidth
                    onClick={() => execute?.()}
                  >
                    {isWritePending ? <Dots>Confirm Transaction</Dots> : 'Add'}
                  </Button>
                )
              }}
            </ExecuteProvider>
          </Approve2.Root>
        </AddSectionReviewModal>
      </>
    ),
    [chainId, children, createNotification, definition, input0, input1, onSuccess, open, poolState, token0, token1]
  )
}
