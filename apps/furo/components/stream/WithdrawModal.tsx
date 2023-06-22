import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { tryParseAmount } from '@sushiswap/currency'
import { Dots } from '@sushiswap/ui/future/components/dots'
import { _useSendTransaction as useSendTransaction, useAccount, useFuroStreamContract } from '@sushiswap/wagmi'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Stream, useStreamBalance } from '../../lib'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { FuroStreamChainId } from '@sushiswap/furo'
import { Button } from '@sushiswap/ui/future/components/button'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { Dialog } from '@sushiswap/ui/future/components/dialog/Dialog'
import { Text } from '@sushiswap/ui/future/components/input/Text'
import { shortenAddress } from '@sushiswap/format'
import { Chain } from '@sushiswap/chain'

interface WithdrawModalProps {
  stream: Stream
  chainId: FuroStreamChainId
  children?({ disabled, setOpen }: { disabled: boolean; setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ stream, chainId, children }) => {
  const { address } = useAccount()
  const { data: balance } = useStreamBalance({ chainId, streamId: stream.id, token: stream.token })
  const contract = useFuroStreamContract(chainId)

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState<string>('')

  const amount = useMemo(() => {
    if (!stream.token) return undefined
    return tryParseAmount(input, stream.token)
  }, [input, stream.token])

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !amount) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'withdrawStream',
        txHash: data.hash,
        chainId: chainId,
        timestamp: ts,
        groupTimestamp: ts,
        promise: data.wait(),
        summary: {
          pending: `Withdrawing ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          completed: `Successfully withdrawn ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          failed: 'Something went wrong withdrawing from stream',
        },
      })
    },
    [amount, chainId, address]
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!stream || !amount || !chainId || !contract) return

      setRequest({
        from: address,
        to: contract.address,
        data: contract.interface.encodeFunctionData('withdrawFromStream', [
          BigNumber.from(stream.id),
          BigNumber.from(amount.toShare(stream.rebase).quotient.toString()),
          stream.recipient.id,
          false,
          '0x',
        ]),
      })
    },
    [stream, amount, chainId, contract, address]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
    enabled: Boolean(!!stream && !!amount && !!chainId && !!contract),
  })

  if (!address || !stream.canWithdraw(address)) return <></>

  return (
    <>
      {typeof children === 'function' ? (
        children({ disabled: !stream.canWithdraw(address), setOpen })
      ) : (
        <Button
          fullWidth
          disabled={!stream.canWithdraw(address)}
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
            You have{' '}
            <span onClick={() => setInput(balance?.toExact() ?? '')} role="button" className="font-semibold text-blue">
              {balance?.toSignificant(6)} {balance?.currency.symbol}
            </span>{' '}
            available for withdrawal. <br />
            Any withdrawn amount will be sent to{' '}
            <a
              target="_blank"
              className="font-semibold text-blue"
              href={Chain.from(stream.chainId).getAccountUrl(stream.recipient.id)}
              rel="noreferrer"
            >
              {shortenAddress(stream.recipient.id)}
            </a>
          </div>
          <Text
            label="Amount"
            value={input}
            onChange={(val) => setInput(`${val}`)}
            id="withdraw-modal-input"
            testdata-id="withdraw-modal-input"
          />
          <div className="col-span-2 pt-2">
            <Checker.Connect fullWidth>
              <Checker.Network fullWidth chainId={chainId}>
                <Checker.Custom guardWhen={!amount?.greaterThan(0)} guardText="Enter amount">
                  <Checker.Custom
                    guardWhen={Boolean(stream.balance && amount?.greaterThan(stream.balance))}
                    guardText="Not enough available"
                  >
                    <Button
                      size="xl"
                      fullWidth
                      disabled={isWritePending || !stream.balance}
                      onClick={() => sendTransaction?.()}
                      testId="withdraw-modal-confirmation"
                    >
                      {!stream.token ? (
                        'Invalid stream token'
                      ) : isWritePending ? (
                        <Dots>Confirm Withdraw</Dots>
                      ) : (
                        'Withdraw'
                      )}
                    </Button>
                  </Checker.Custom>
                </Checker.Custom>
              </Checker.Network>
            </Checker.Connect>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
