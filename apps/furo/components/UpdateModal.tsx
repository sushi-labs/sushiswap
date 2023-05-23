import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { PencilIcon } from '@heroicons/react/outline'
import { Amount, Token } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { JSBI, ZERO } from '@sushiswap/math'
import { classNames, Dots } from '@sushiswap/ui'
import { _useSendTransaction as useSendTransaction, useAccount, useContract } from '@sushiswap/wagmi'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useRef, useState } from 'react'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Button } from '@sushiswap/ui/future/components/button/Button'
import { Stream } from '../lib'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { Dialog } from '@sushiswap/ui/future/components/dialog/Dialog'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Input } from '@sushiswap/ui/future/components/input'
import { Switch } from '@sushiswap/ui/future/components/Switch'
import { Simulate } from 'react-dom/test-utils'

interface UpdateModalProps {
  stream: Stream
  abi: NonNullable<Parameters<typeof useContract>['0']>['abi']
  address: string
  chainId: BentoBoxV1ChainId
  children?({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
}

export const UpdateModal: FC<UpdateModalProps> = ({ stream, abi, address: contractAddress, chainId, children }) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const [topUp, setTopUp] = useState(false)
  const [changeEndDate, setChangeEndDate] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [endDate, setEndDate] = useState<Date | null>(null)
  const customInputRef = useRef<HTMLInputElement | null>(null)
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

  if (!stream || !address || !stream?.canUpdate(address)) return <></>

  return (
    <>
      {typeof children === 'function' ? (
        children({ setOpen })
      ) : (
        <Button
          fullWidth
          startIcon={<PencilIcon width={18} height={18} />}
          onClick={() => setOpen(true)}
          disabled={!stream?.canUpdate(address)}
        >
          Update
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !pb-3 !bg-gray-100 dark:!bg-slate-800">
          <Dialog.Header title="Update Stream" onClose={() => setOpen(false)} />
          <List>
            <List.Label>Stream details</List.Label>
            <List.Control>
              <List.KeyValue title="Recipient">{shortenAddress(stream.recipient.id)}</List.KeyValue>
              <List.KeyValue title="Amount">
                {stream.remainingAmount.toSignificant(6)} {stream.token.symbol}
              </List.KeyValue>
              <List.KeyValue title="Start date">{stream.startTime.toLocaleString()}</List.KeyValue>
              <List.KeyValue title="End date">{stream.endTime.toLocaleString()}</List.KeyValue>
            </List.Control>
          </List>
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 pb-2">
              <List.Label className="text-gray-500 dark:text-slate-50">Top up amount</List.Label>
              <Switch checked={topUp} onChange={() => setTopUp((prevState) => !prevState)} size="sm" />
            </div>
            <div className={classNames(topUp ? '' : 'opacity-40 pointer-events-none', 'flex flex-col gap-2')}>
              <Input.Text<string>
                label={`Amount (${stream.token.symbol})`}
                id={'furo-stream-top-up'}
                value={amount}
                onChange={setAmount}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 py-2">
              <List.Label className="text-gray-500 dark:text-slate-50">Change end date</List.Label>
              <Switch checked={changeEndDate} onChange={() => setChangeEndDate((prevState) => !prevState)} size="sm" />
            </div>
            <div className={classNames(changeEndDate ? '' : 'opacity-40 pointer-events-none', 'flex flex-col gap-2')}>
              <Input.DatePicker
                customInput={<Input.DatePickerCustomInput id="stream-update-end-date" label="End date" />}
                onChange={(date) => setEndDate(date)}
                selected={endDate}
                portalId="root-portal"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                minDate={stream.endTime}
                dateFormat="MMM d, yyyy HH:mm"
                autoComplete="off"
                isClearable={false}
              />
            </div>
          </div>
          <div>
            <Checker.Connect type="button" size="xl" fullWidth>
              <Checker.Network type="button" size="xl" fullWidth chainId={chainId}>
                <Checker.Custom
                  showGuardIfTrue={topUp && !amountAsEntity?.greaterThan(ZERO)}
                  guard={
                    <Button type="button" size="xl" fullWidth>
                      Enter amount
                    </Button>
                  }
                >
                  <Checker.Custom
                    showGuardIfTrue={changeEndDate && !endDate}
                    guard={
                      <Button type="button" size="xl" fullWidth>
                        Enter date
                      </Button>
                    }
                  >
                    <Checker.ApproveERC20
                      id="approve-erc20-update-stream"
                      type="button"
                      size="xl"
                      fullWidth
                      amount={amountAsEntity}
                      contract={bentoBoxV1Address[chainId]}
                      enabled={topUp}
                    >
                      <Button
                        type="button"
                        size="xl"
                        fullWidth
                        disabled={isWritePending || (!topUp && !changeEndDate)}
                        onClick={() => sendTransaction?.()}
                      >
                        {isWritePending ? <Dots>Confirm Update</Dots> : 'Update'}
                      </Button>
                    </Checker.ApproveERC20>
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
