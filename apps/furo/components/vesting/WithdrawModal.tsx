import { FuroVestingChainId } from '@sushiswap/furo'
import { ZERO } from '@sushiswap/math'
import { Button } from '@sushiswap/ui/components/button'
import { Dialog } from '@sushiswap/ui/components/dialog'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import { useAccount, useFuroVestingContract, usePrepareSendTransaction } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { encodeFunctionData } from 'viem'

import { useVestingBalance, Vesting } from '../../lib'

interface WithdrawModalProps {
  vesting?: Vesting
  chainId: FuroVestingChainId
  children?({ disabled, setOpen }: { disabled: boolean; setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ vesting, chainId, children }) => {
  const [open, setOpen] = useState(false)
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

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
    gas: config?.gas ? (config.gas * 120n) / 100n : undefined,
  })

  return (
    <>
      {typeof children === 'function' ? (
        children({ disabled: !vesting?.canWithdraw(address), setOpen })
      ) : (
        <Button
          fullWidth
          disabled={!address || !vesting?.canWithdraw(address) || !balance || !balance?.greaterThan(0)}
          onClick={() => {
            setOpen(true)
          }}
        >
          Withdraw
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !pb-3 !bg-white dark:!bg-slate-800">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <div className="text-gray-700 dark:text-slate-400">
            There are currently{' '}
            <span className="font-semibold">
              {balance?.toSignificant(6)} {balance?.currency.symbol}
            </span>{' '}
            unlocked tokens available for withdrawal.
          </div>
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={chainId}>
              <Checker.Custom guardWhen={Boolean(!balance?.greaterThan(ZERO))} guardText="Not enough available">
                <Button
                  size="xl"
                  fullWidth
                  disabled={isWritePending || !sendTransaction}
                  onClick={() => sendTransaction?.()}
                  testId="withdraw-modal-confirmation"
                >
                  {!vesting?.token ? 'Invalid vest token' : isWritePending ? <Dots>Confirm Withdraw</Dots> : 'Withdraw'}
                </Button>
              </Checker.Custom>
            </Checker.Network>
          </Checker.Connect>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
