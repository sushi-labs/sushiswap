import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource, useFundSourceToggler } from '@sushiswap/hooks'
import { Button, classNames, DEFAULT_INPUT_BG, Dialog, Dots, Typography } from '@sushiswap/ui'
import { Checker, useFuroStreamContract, _useSendTransaction as useSendTransaction, Web3Input } from '@sushiswap/wagmi'
import { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { BottomPanel, CurrencyInputBase } from '../../components'
import { Stream } from '../../lib'
import { useStreamBalance } from '../../lib'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { FuroStreamChainId } from '@sushiswap/furo'

interface WithdrawModalProps {
  stream?: Stream
  chainId: FuroStreamChainId
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ stream, chainId }) => {
  const { address } = useAccount()
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.WALLET)
  const balance = useStreamBalance(chainId, stream?.id, stream?.token)
  const contract = useFuroStreamContract(chainId)

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState<string>('')
  const [withdrawTo, setWithdrawTo] = useState<string>()

  const amount = useMemo(() => {
    if (!stream?.token) return undefined
    return tryParseAmount(input, stream.token)
  }, [input, stream?.token])

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
          withdrawTo ?? stream.recipient.id,
          fundSource === FundSource.BENTOBOX,
          '0x',
        ]),
      })
    },
    [stream, amount, chainId, contract, address, withdrawTo, fundSource]
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

  return (
    <>
      <Checker.Connected size="md">
        <Checker.Network size="md" chainId={chainId}>
          <Button
            fullWidth
            size="md"
            variant="filled"
            disabled={!stream?.canWithdraw(address)}
            onClick={() => {
              setOpen(true)
            }}
          >
            Withdraw
          </Button>
        </Checker.Network>
      </Checker.Connected>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !max-w-xs !pb-3">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <div className="flex flex-col gap-2">
            <CurrencyInputBase
              inputClassName="pb-2"
              className="ring-offset-slate-800"
              currency={stream?.token}
              onChange={setInput}
              value={input}
              error={amount && stream?.balance && amount.greaterThan(stream.balance)}
              bottomPanel={<BottomPanel loading={false} label="Available" amount={balance} />}
            />
          </div>
          <div className="flex flex-col">
            <Web3Input.Ens
              id="withdraw-stream-recipient"
              value={withdrawTo}
              onChange={setWithdrawTo}
              className="ring-offset-slate-800"
              placeholder="Recipient (optional)"
            />
          </div>
          <div className="grid items-center grid-cols-2 gap-3">
            <div
              onClick={() => setFundSource(FundSource.WALLET)}
              className={classNames(
                fundSource === FundSource.WALLET ? 'ring-green/70' : 'ring-transparent',
                DEFAULT_INPUT_BG,
                'ring-2 ring-offset-2 ring-offset-slate-800 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
              )}
            >
              <Typography weight={500} variant="sm" className="!leading-5 tracking-widest text-slate-200">
                Wallet
              </Typography>
              <Typography variant="xs" className="text-slate-400">
                Receive funds in your Wallet
              </Typography>
              {fundSource === FundSource.WALLET && (
                <div className="absolute w-5 h-5 top-3 right-3">
                  <CheckCircleIcon className="text-green/70" />
                </div>
              )}
            </div>
            <div
              onClick={() => setFundSource(FundSource.BENTOBOX)}
              className={classNames(
                fundSource === FundSource.BENTOBOX ? 'ring-green/70' : 'ring-transparent',
                DEFAULT_INPUT_BG,
                'ring-2 ring-offset-2 ring-offset-slate-800 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
              )}
            >
              <Typography weight={500} variant="sm" className="!leading-5 tracking-widest text-slate-200">
                BentoBox
              </Typography>
              <Typography variant="xs" className="text-slate-400">
                Receive funds in your BentoBox
              </Typography>
              {fundSource === FundSource.BENTOBOX && (
                <div className="absolute w-5 h-5 top-3 right-3">
                  <CheckCircleIcon className="text-green/70" />
                </div>
              )}
            </div>
            <div className="col-span-2 pt-2">
              <Checker.Custom
                showGuardIfTrue={!amount?.greaterThan(0)}
                guard={
                  <Button size="md" fullWidth>
                    Enter amount
                  </Button>
                }
              >
                <Checker.Custom
                  showGuardIfTrue={Boolean(stream?.balance && amount?.greaterThan(stream.balance))}
                  guard={
                    <Button size="md" fullWidth>
                      Not enough available
                    </Button>
                  }
                >
                  <Button
                    size="md"
                    variant="filled"
                    fullWidth
                    disabled={isWritePending || !stream?.balance}
                    onClick={() => sendTransaction?.()}
                  >
                    {!stream?.token ? (
                      'Invalid stream token'
                    ) : isWritePending ? (
                      <Dots>Confirm Withdraw</Dots>
                    ) : (
                      'Withdraw'
                    )}
                  </Button>
                </Checker.Custom>
              </Checker.Custom>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
