import { Signature } from '@ethersproject/bytes'
import { ConstantProductPool, StablePool } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { Button, Dots } from '@sushiswap/ui'
import {
  BENTOBOX_ADDRESS,
  ConstantProductPoolState,
  getTridentRouterContractConfig,
  StablePoolState,
} from '@sushiswap/wagmi'
import { Approve2 } from '@sushiswap/wagmi/systems/Approve2'
import { ApprovalType, ApproveDefinition } from '@sushiswap/wagmi/systems/Approve2/types'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { useNotifications } from '../../../lib/state/storage'
import { AddSectionReviewModal } from '../AddSectionReviewModal'
import { ExecuteProvider } from './ExecuteProvider'

export interface AddSectionReviewModalTridentProps {
  poolAddress: string
  poolState: ConstantProductPoolState | StablePoolState | undefined
  pool: ConstantProductPool | StablePool | null | undefined
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children({ setOpen }: { setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalTrident: FC<AddSectionReviewModalTridentProps> = ({
  poolAddress,
  poolState,
  pool,
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
  const [permit, setPermit] = useState<Signature>()

  const definition = useMemo(() => {
    const definition: ApproveDefinition = []
    if (getTridentRouterContractConfig(chainId).address) {
      definition.push({
        type: ApprovalType.Bentobox,
        masterContract: getTridentRouterContractConfig(chainId).address,
        buttonProps: {
          fullWidth: true,
          className: 'whitespace-nowrap',
          size: 'md',
          id: 'add-liquidity-trident-approve-bentobox',
        },
        onSignature: setPermit,
      })
    }

    if (BENTOBOX_ADDRESS[chainId]) {
      definition.push({
        type: ApprovalType.Token,
        amount: input0,
        address: BENTOBOX_ADDRESS[chainId],
        buttonProps: {
          fullWidth: true,
          className: 'whitespace-nowrap',
          size: 'md',
          id: 'add-liquidity-trident-approve-token0',
        },
      })
    }

    if (BENTOBOX_ADDRESS[chainId]) {
      definition.push({
        type: ApprovalType.Token,
        amount: input1,
        address: BENTOBOX_ADDRESS[chainId],
        buttonProps: {
          fullWidth: true,
          className: 'whitespace-nowrap',
          size: 'md',
          id: 'add-liquidity-trident-approve-token1',
        },
      })
    }

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
              signature={permit}
              poolAddress={poolAddress}
              poolState={poolState}
              pool={pool}
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
                    testdata-id="add-trident-review-confirm-button"
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
    [
      chainId,
      children,
      createNotification,
      definition,
      input0,
      input1,
      onSuccess,
      open,
      permit,
      pool,
      poolAddress,
      poolState,
      token0,
      token1,
    ]
  )
}
