'use client'

import { TTLStorageKey } from '@sushiswap/hooks'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  Button,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogType,
  Dots,
  Message,
  Switch,
  useDialog,
} from '@sushiswap/ui'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { logger } from 'src/lib/logger'
import {
  INFINITY_CL_POSITION_MANAGER_ABI,
  decodeSushiSwapV4PoolKey,
  encodeCLPositionManagerDecreaseLiquidityCalldata,
  encodeCLPositionManagerMulticall,
} from 'src/lib/pool/v4'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { EvmNative, getEvmChainById } from 'sushi/evm'
import { type SendTransactionReturnType, zeroAddress } from 'viem'
import {
  type UseCallParameters,
  useCall,
  useConnection,
  usePublicClient,
  useReadContracts,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import type { ClaimableV4Fees } from './v4-claimable-fees-tab'

interface V4CollectAllFeesDialog {
  account: `0x${string}` | undefined
  claimableFees: ClaimableV4Fees
  children: ReactNode
}

export const V4CollectAllFeesDialog: FC<V4CollectAllFeesDialog> = (props) => {
  return (
    <DialogProvider>
      <_V4CollectAllFeesDialog {...props} />
    </DialogProvider>
  )
}

const _V4CollectAllFeesDialog: FC<V4CollectAllFeesDialog> = ({
  account,
  claimableFees,
  children,
}) => {
  const { chainId, deployment, tokenIds } = claimableFees
  const { open: isOpen } = useDialog(DialogType.Review)
  const { chain } = useConnection()
  const client = usePublicClient({ chainId })
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const [receiveWrapped, setReceiveWrapped] = useState(false)
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.RemoveLiquidity,
    chainId,
  })

  const positionReads = useReadContracts({
    allowFailure: true,
    contracts: tokenIds.map((tokenId) => ({
      address: deployment.clPositionManager,
      abi: INFINITY_CL_POSITION_MANAGER_ABI,
      functionName: 'positions',
      args: [tokenId],
      chainId,
    })),
    query: {
      enabled: isOpen,
    },
  })

  const positions = useMemo(() => {
    return (
      positionReads.data?.flatMap((result, index) => {
        if (result.status !== 'success') return []
        const tokenId = tokenIds[index]
        if (tokenId === undefined) return []

        return [
          {
            tokenId,
            poolKey: decodeSushiSwapV4PoolKey(result.result[0]),
          },
        ]
      }) ?? []
    )
  }, [positionReads.data, tokenIds])

  const hasNativePosition = positions.some(
    ({ poolKey }) => poolKey.currency0 === zeroAddress,
  )
  const hasReadError =
    positionReads.isError ||
    Boolean(positionReads.data?.some((result) => result.status === 'failure'))

  const calls = useMemo(() => {
    if (
      !account ||
      !deadline ||
      positions.length !== tokenIds.length ||
      hasReadError
    ) {
      return []
    }

    return positions.map(({ poolKey, tokenId }) =>
      encodeCLPositionManagerDecreaseLiquidityCalldata({
        tokenId,
        poolKey,
        liquidity: 0n,
        amount0Min: 0n,
        amount1Min: 0n,
        wrapAddress:
          receiveWrapped && poolKey.currency0 === zeroAddress
            ? EvmNative.fromChainId(chainId).wrap().address
            : undefined,
        recipient: account,
        hookData: '0x',
        deadline,
      }),
    )
  }, [
    account,
    chainId,
    deadline,
    hasReadError,
    positions,
    receiveWrapped,
    tokenIds.length,
  ])

  const prepare = useMemo(() => {
    if (calls.length === 0) return undefined

    return {
      to: deployment.clPositionManager,
      data: encodeCLPositionManagerMulticall(calls),
      value: 0n,
      chainId,
    } satisfies UseCallParameters
  }, [calls, chainId, deployment.clPositionManager])

  const simulation = useCall({
    ...prepare,
    query: {
      enabled: Boolean(isOpen && prepare && chainId === chain?.id),
    },
  })

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const timestamp = Date.now()
      void createToast({
        account,
        type: 'claimRewards',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: 'Collecting fees from your V4 positions',
          completed: 'Successfully collected fees from your V4 positions',
          failed: 'Something went wrong when trying to collect V4 fees',
        },
        timestamp,
        groupTimestamp: timestamp,
      })
    },
    [account, chainId, client, refetchBalances],
  )

  const onError = useCallback((error: Error) => {
    if (isUserRejectedError(error)) return

    logger.error(error, {
      location: 'V4CollectAllFeesDialog',
      action: 'mutationError',
    })
    createErrorToast(error.message, true)
  }, [])

  const {
    data: hash,
    isPending: isWritePending,
    mutateAsync: sendTransactionAsync,
  } = useSendTransaction({
    mutation: {
      onSuccess,
      onError,
    },
  })
  const receipt = useWaitForTransactionReceipt({ chainId, hash })

  const send = useMemo(() => {
    if (!prepare || simulation.isError) return undefined

    return async (confirm: () => void) => {
      try {
        await sendTransactionAsync(prepare)
        confirm()
      } catch {}
    }
  }, [prepare, sendTransactionAsync, simulation.isError])

  const isPreparing =
    positionReads.isPending || !deadline || simulation.isPending

  return (
    <>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Claim V4 Fees</DialogTitle>
                <DialogDescription>
                  From {tokenIds.length} position
                  {tokenIds.length === 1 ? '' : 's'} on{' '}
                  {getEvmChainById(chainId).name}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Message>
                  Fee amounts are calculated by the V4 PositionManager when the
                  claim is executed.
                </Message>
                {hasReadError ? (
                  <Message variant="destructive">
                    One or more V4 positions could not be loaded.
                  </Message>
                ) : null}
                {hasNativePosition ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Receive {EvmNative.fromChainId(chainId).wrap().symbol}{' '}
                      instead of {EvmNative.fromChainId(chainId).symbol}
                    </span>
                    <Switch
                      checked={receiveWrapped}
                      onCheckedChange={setReceiveWrapped}
                    />
                  </div>
                ) : null}
              </div>
              <DialogFooter>
                <Button
                  fullWidth
                  size="xl"
                  loading={isPreparing || isWritePending}
                  disabled={hasReadError || simulation.isError || !send}
                  onClick={() => send?.(confirm)}
                  testId="confirm-claim-v4-fees"
                  type="button"
                >
                  {simulation.isError ? (
                    'Shoot! Something went wrong :('
                  ) : isWritePending ? (
                    <Dots>Confirm Claim</Dots>
                  ) : (
                    'Claim'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={receipt.status}
        testId="claim-v4-fees-confirmation"
        buttonText="Close"
        txHash={hash}
        successMessage="You successfully claimed fees from your V4 positions"
      />
    </>
  )
}
