import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { CheckIcon, PencilIcon, XIcon } from '@heroicons/react/outline'
import { Amount, Token } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { JSBI } from '@sushiswap/math'
import { Button, classNames, DEFAULT_INPUT_CLASSNAME, Dialog, Dots, Input, Switch, Typography } from '@sushiswap/ui'
import { Approve, Checker, _useSendTransaction as useSendTransaction } from '@sushiswap/wagmi'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount, useContract } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { CurrencyInput } from '../components'
import { Stream } from '../lib'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'

interface UpdateModalProps {
  stream?: Stream
  abi: NonNullable<Parameters<typeof useContract>['0']>['abi']
  address: string
  chainId: BentoBoxV1ChainId
}

export const UpdateModal: FC<UpdateModalProps> = ({ stream, abi, address: contractAddress, chainId }) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const [topUp, setTopUp] = useState(false)
  const [changeEndDate, setChangeEndDate] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [endDate, setEndDate] = useState<Date | null>(null)

  const contract = useContract({
    address: contractAddress,
    abi: abi,
  })

  const amountAsEntity = useMemo(() => {
    if (!stream || !amount) return undefined

    let value: Amount<Token> | undefined = undefined
    try {
      value = Amount.fromRawAmount(stream.token, JSBI.BigInt(parseUnits(amount, stream.token.decimals).toString()))
    } catch (e) {
      console.debug(e)
    }

    return value
  }, [amount, stream])

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !amount) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'updateStream',
        txHash: data.hash,
        chainId,
        timestamp: ts,
        groupTimestamp: ts,
        promise: data.wait(),
        summary: {
          pending: `Updating stream`,
          completed: `Successfully updated stream`,
          failed: 'Something went wrong updating the stream',
        },
      })
    },
    [amount, chainId, address]
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!stream?.canUpdate(address) || !stream || !chainId || !contractAddress) return
      if (topUp && !amount) return
      if (changeEndDate && !endDate) return

      const difference =
        changeEndDate && endDate ? Math.floor((endDate?.getTime() - stream?.endTime.getTime()) / 1000) : 0
      const topUpAmount = amountAsEntity?.greaterThan(0) ? amountAsEntity.quotient.toString() : '0'

      setRequest({
        from: address,
        to: contractAddress,
        data: contract?.interface.encodeFunctionData('updateStream', [
          BigNumber.from(stream.id),
          BigNumber.from(topUp ? topUpAmount : '0'),
          difference,
          false,
        ]),
      })
    },
    [
      address,
      amount,
      amountAsEntity,
      chainId,
      changeEndDate,
      contract?.interface,
      contractAddress,
      endDate,
      stream,
      topUp,
    ]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
    enabled: Boolean(
      !(
        !stream?.canUpdate(address) ||
        !contractAddress ||
        !stream ||
        !chainId ||
        (topUp && !amount) ||
        (changeEndDate && !endDate)
      )
    ),
  })

  if (!stream || !address || !stream?.canUpdate(address)) return null

  return (
    <>
      <Checker.Connected>
        <Checker.Network chainId={chainId}>
          <Button
            color="gray"
            fullWidth
            startIcon={<PencilIcon width={18} height={18} />}
            onClick={() => setOpen(true)}
            disabled={!stream?.canUpdate(address)}
          >
            Update
          </Button>
        </Checker.Network>
      </Checker.Connected>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="!space-y-4 !max-w-sm !pb-4">
          <Dialog.Header title="Update Stream" onClose={() => setOpen(false)} />
          <div className="grid grid-cols-2 gap-2">
            <Typography variant="sm" weight={500} className="text-slate-400">
              Recipient
            </Typography>
            <Typography variant="sm" weight={500} className="text-right text-slate-50">
              {shortenAddress(stream.recipient.id)}
            </Typography>
            <Typography variant="sm" weight={500} className="text-slate-400">
              Stream Amount
            </Typography>
            <Typography variant="sm" weight={500} className="text-right text-slate-50">
              {stream.remainingAmount.toSignificant(6)}{' '}
              <span className="font-medium text-slate-500">{stream.token.symbol}</span>
            </Typography>
            <Typography variant="sm" weight={500} className="text-slate-400">
              Start date
            </Typography>
            <Typography variant="sm" weight={500} className="text-right text-slate-50">
              {stream.startTime.toLocaleString()}
            </Typography>
            <Typography variant="sm" weight={500} className="text-slate-400">
              End date
            </Typography>
            <Typography variant="sm" weight={500} className="text-right text-slate-50">
              {stream.endTime.toLocaleString()}
            </Typography>
          </div>
          <div className="h-px my-2 bg-slate-800" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 pb-2">
              <Typography variant="sm" weight={500} className="text-slate-50">
                Top up amount
              </Typography>
              <Switch
                checked={topUp}
                onChange={() => setTopUp((prevState) => !prevState)}
                size="sm"
                uncheckedIcon={<XIcon />}
                checkedIcon={<CheckIcon />}
              />
            </div>
            <div className="flex flex-col gap-2">
              <CurrencyInput
                id={'furo-stream-top-up'}
                fundSource={FundSource.WALLET}
                className={classNames(topUp ? '' : 'opacity-40 pointer-events-none', 'ring-offset-slate-800')}
                onChange={setAmount}
                currency={stream.token}
                value={amount}
                account={address}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 py-2">
              <Typography variant="sm" weight={500} className="text-slate-50">
                Change end date
              </Typography>
              <Switch
                checked={changeEndDate}
                onChange={() => setChangeEndDate((prevState) => !prevState)}
                size="sm"
                uncheckedIcon={<XIcon />}
                checkedIcon={<CheckIcon />}
              />
            </div>
            <Input.DatePicker
              className={classNames(
                DEFAULT_INPUT_CLASSNAME,
                '!ring-offset-slate-900',
                !changeEndDate ? 'opacity-40 pointer-events-none' : ''
              )}
              onChange={(date) => setEndDate(date)}
              selected={endDate}
              portalId="root-portal"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              minDate={stream.endTime}
              dateFormat="MMM d, yyyy HH:mm"
              placeholderText="Select date"
              autoComplete="off"
            />
          </div>
          <div>
            <Approve
              components={
                <Approve.Components>
                  <Approve.Token
                    enabled={amountAsEntity?.greaterThan(0)}
                    amount={amountAsEntity}
                    address={bentoBoxV1Address[chainId]}
                    fullWidth
                    size="md"
                  />
                </Approve.Components>
              }
              render={({ approved }) => {
                return (
                  <Button
                    type="button"
                    size="md"
                    variant="filled"
                    fullWidth
                    disabled={isWritePending || !approved}
                    onClick={() => sendTransaction?.()}
                  >
                    {isWritePending ? <Dots>Confirm Update</Dots> : 'Update'}
                  </Button>
                )
              }}
            />
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
