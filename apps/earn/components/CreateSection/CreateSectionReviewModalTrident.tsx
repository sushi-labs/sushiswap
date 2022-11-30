import { Signature } from '@ethersproject/bytes'
import { Fee } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { Button, Dots } from '@sushiswap/ui'
import { BENTOBOX_ADDRESS, getTridentRouterContractConfig, PoolFinderType } from '@sushiswap/wagmi'
import { Approve2 } from '@sushiswap/wagmi/systems/Approve2'
import { ApprovalType, ApproveDefinition } from '@sushiswap/wagmi/systems/Approve2/types'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { useNotifications } from '../../lib/state/storage'
import { AddSectionReviewModal } from '../AddSection'
import { ExecuteProvider } from './ExecuteProvider'

export interface CreateSectionReviewModalTridentProps {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  fee: Fee
  poolType: PoolFinderType
  children({ setOpen }: { setOpen(open: boolean): void }): ReactNode
}

export const CreateSectionReviewModalTrident: FC<CreateSectionReviewModalTridentProps> = ({
  token0,
  token1,
  input0,
  input1,
  fee,
  poolType,
  chainId,
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
          id: 'create-trident-approve-bentobox',
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
          id: 'create-trident-approve-token0',
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
          id: 'create-trident-approve-token1',
        },
      })
    }

    return definition
  }, [chainId, input0, input1])

  const onSuccess = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      {children({ setOpen })}
      <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
        <Approve2.Root chainId={chainId} onSuccess={createNotification} definition={definition}>
          <ExecuteProvider
            signature={permit}
            onSuccess={onSuccess}
            chainId={chainId}
            token0={token0}
            token1={token1}
            input0={input0}
            input1={input1}
            fee={fee}
            poolType={poolType}
          >
            {({ isWritePending, execute }) => {
              return (
                <Button
                  size="md"
                  testdata-id="create-trident-review-confirm-button"
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
  )
}
