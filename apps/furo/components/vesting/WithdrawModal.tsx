import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { useAccount, useFuroVestingContract } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useState } from 'react'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useVestingBalance, Vesting } from '../../lib'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { FuroVestingChainId } from '@sushiswap/furo'
import { Button } from '@sushiswap/ui/future/components/button'
import { ZERO } from '@sushiswap/math'
import { Dialog } from '@sushiswap/ui/future/components/dialog'

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
        promise: data.wait(),
        summary: {
          pending: `Withdrawing ${balance.toSignificant(6)} ${balance.currency.symbol}`,
          completed: `Successfully withdrawn ${balance.toSignificant(6)} ${balance.currency.symbol}`,
          failed: 'Something went wrong withdrawing from vesting schedule',
        },
      })
    },
    [balance, chainId, address]
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!vesting || !balance || !contract || !address) return

      setRequest({
        from: address,
        to: contract.address,
        data: contract.interface.encodeFunctionData('withdraw', [BigNumber.from(vesting.id), '0x', false]),
      })
    },
    [vesting, balance, contract, address]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
    enabled: Boolean(vesting && balance && contract),
    gasMargin: true,
  })

  return (
    <>
      {typeof children === 'function' ? (
        children({ disabled: !vesting?.canWithdraw(address), setOpen })
      ) : (
        <Button
          fullWidth
          size="xl"
          variant="filled"
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
          <Checker.Connect size="xl" fullWidth>
            <Checker.Network size="xl" fullWidth chainId={chainId}>
              <Checker.Custom
                showGuardIfTrue={Boolean(!balance?.greaterThan(ZERO))}
                guard={
                  <Button size="xl" fullWidth>
                    Not enough available
                  </Button>
                }
              >
                <Button
                  size="xl"
                  variant="filled"
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
