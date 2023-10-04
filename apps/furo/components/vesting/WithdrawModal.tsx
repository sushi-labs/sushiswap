import { DownloadIcon } from '@heroicons/react/outline'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { ZERO } from 'sushi'
import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  useAccount,
  useFuroVestingContract,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { FC, useCallback, useMemo } from 'react'
import { encodeFunctionData } from 'viem'

import { useVestingBalance, Vesting } from '../../lib'

interface WithdrawModalProps {
  vesting?: Vesting
  chainId: FuroChainId
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ vesting, chainId }) => {
  const { address } = useAccount()
  const { data: balance } = useVestingBalance({ vestingId: vesting?.id, chainId, token: vesting?.token })
  const contract = useFuroVestingContract(chainId)

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !balance) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'withdrawVesting',
        txHash: data.hash,
        chainId,
        timestamp: ts,
        groupTimestamp: ts,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Withdrawing ${balance.toSignificant(6)} ${balance.currency.symbol}`,
          completed: `Successfully withdrawn ${balance.toSignificant(6)} ${balance.currency.symbol}`,
          failed: 'Something went wrong withdrawing from vesting schedule',
        },
      })
    },
    [balance, chainId, address]
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!vesting || !balance || !contract || !address) return {}

    return {
      account: address,
      to: contract.address,
      data: encodeFunctionData({
        abi: contract.abi,
        functionName: 'withdraw',
        args: [BigInt(vesting.id), '0x', false],
      }),
    }
  }, [vesting, balance, contract, address])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(vesting && balance && contract),
  })

  const {
    sendTransactionAsync,
    data,
    isLoading: isWritePending,
  } = useSendTransaction({
    ...config,
    onSettled,
    gas: config?.gas ? (config.gas * 120n) / 100n : undefined,
  })

  const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <DialogTrigger asChild>
              <Button
                disabled={!vesting?.canWithdraw(address)}
                icon={DownloadIcon}
                testId="vest-withdraw"
                variant="secondary"
              >
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw</DialogTitle>
                <DialogDescription>
                  There are currently{' '}
                  <span className="font-semibold">
                    {balance?.toSignificant(6)} {balance?.currency.symbol}
                  </span>{' '}
                  unlocked tokens available for withdrawal.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4" />
              <DialogFooter>
                <Checker.Connect fullWidth>
                  <Checker.Network fullWidth chainId={chainId}>
                    <Checker.Guard
                      guardWhen={Boolean(!balance?.greaterThan(ZERO))}
                      guardText="No unlocked tokens for withdrawal"
                    >
                      <Button
                        size="xl"
                        fullWidth
                        disabled={isWritePending || !sendTransactionAsync}
                        onClick={() => sendTransactionAsync?.().then(() => confirm())}
                        testId="withdraw-modal-confirmation"
                      >
                        {!vesting?.token ? (
                          'Invalid vest token'
                        ) : isWritePending ? (
                          <Dots>Confirm Withdraw</Dots>
                        ) : (
                          'Withdraw'
                        )}
                      </Button>
                    </Checker.Guard>
                  </Checker.Network>
                </Checker.Connect>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="withdraw-vest-confirmation-modal"
        successMessage={'Successfully withdrawn from vest'}
        txHash={data?.hash}
      />
    </DialogProvider>
  )
}
