import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { PencilIcon } from '@heroicons/react/outline'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Amount, Token } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { FuroStreamChainId } from '@sushiswap/furo'
import { JSBI, ZERO } from '@sushiswap/math'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dialog } from '@sushiswap/ui/components/dialog/Dialog'
import { Dots } from '@sushiswap/ui/components/dots'
import { Input } from '@sushiswap/ui/components/input'
import { List } from '@sushiswap/ui/components/list/List'
import { Switch } from '@sushiswap/ui/components/switch'
import { createToast } from '@sushiswap/ui/components/toast'
import { _useSendTransaction as useSendTransaction, Address, useAccount, useContract } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'

import { approveBentoBoxAction, batchAction, Stream } from '../../lib'

const APPROVE_TAG = 'updateStreamSingle'

interface UpdateModalProps {
  stream: Stream
  abi: NonNullable<Parameters<typeof useContract>['0']>['abi']
  address: string
  chainId: FuroStreamChainId
  children?({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
}

export const UpdateModal: FC<UpdateModalProps> = withCheckerRoot(
  ({ stream, abi, address: contractAddress, chainId, children }) => {
    const { address } = useAccount()
    const { approved } = useApproved(APPROVE_TAG)
    const [open, setOpen] = useState(false)
    const [topUp, setTopUp] = useState(false)
    const [changeEndDate, setChangeEndDate] = useState(false)
    const [amount, setAmount] = useState<string>('')
    const [endDate, setEndDate] = useState<Date | null>(null)
    const { signature, setSignature } = useSignature(APPROVE_TAG)
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
            pending: 'Updating stream',
            completed: 'Successfully updated stream',
            failed: 'Something went wrong updating the stream',
          },
        })
      },
      [amount, chainId, address]
    )

    const isTopUpValid = useMemo(() => {
      return !topUp || Boolean(topUp && amountAsEntity)
    }, [topUp, amountAsEntity])
    const isChangeEndDateValid = useMemo(() => {
      return !changeEndDate || Boolean(changeEndDate && endDate)
    }, [changeEndDate, endDate])

    const prepare = useCallback(
      (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
        if (!stream?.canUpdate(address) || !stream || !chainId || !contractAddress || !contract) return
        if (topUp && !amount) return
        if (changeEndDate && !endDate) return

        const actions: string[] = []
        if (signature) {
          actions.push(approveBentoBoxAction({ contract, user: address as Address, signature }))
        }

        const difference =
          changeEndDate && endDate ? Math.floor((endDate?.getTime() - stream?.endTime.getTime()) / 1000) : 0
        const topUpAmount = amountAsEntity?.greaterThan(0) ? amountAsEntity.quotient.toString() : '0'

        actions.push(
          contract.interface.encodeFunctionData('updateStream', [
            BigNumber.from(stream.id),
            BigNumber.from(topUp ? topUpAmount : '0'),
            difference,
            false,
          ])
        )

        setRequest({
          from: address,
          to: contractAddress,
          data: batchAction({ contract, actions }),
        })
      },
      [
        stream,
        address,
        chainId,
        contractAddress,
        contract,
        topUp,
        amount,
        changeEndDate,
        endDate,
        signature,
        amountAsEntity,
      ]
    )

    const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
      chainId,
      prepare,
      onSettled,
      onSuccess() {
        setOpen(false)
        setSignature(undefined)
      },
      enabled: Boolean(
        !(
          !stream?.canUpdate(address) ||
          !contractAddress ||
          !stream ||
          !chainId ||
          !isTopUpValid ||
          !isChangeEndDateValid ||
          !approved
        )
      ),
    })

    // console.log('isTopUpValid', isTopUpValid)
    // console.log('isChangeEndDateValid', isChangeEndDateValid)
    // if (!stream || !address || !stream?.canUpdate(address)) return <></>
    return (
      <>
        {typeof children === 'function' ? (
          children({ setOpen })
        ) : (
          <Button fullWidth icon={PencilIcon} onClick={() => setOpen(true)} disabled={!stream?.canUpdate(address)}>
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
                <Switch
                  testdata-id="update-amount-switch"
                  checked={topUp}
                  onCheckedChange={() => setTopUp((prevState) => !prevState)}
                />
              </div>
              <div className={classNames(topUp ? '' : 'opacity-40 pointer-events-none', 'flex flex-col gap-2')}>
                <Input.Text
                  label={`Amount (${stream.token.symbol})`}
                  id="furo-stream-top-up"
                  testdata-id="furo-stream-top-up"
                  value={amount}
                  onChange={(val) => setAmount(`${val}`)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-3 py-2">
                <List.Label className="text-gray-500 dark:text-slate-50">Change end date</List.Label>
                <Switch
                  testdata-id="update-end-date-switch"
                  checked={changeEndDate}
                  onCheckedChange={() => setChangeEndDate((prevState) => !prevState)}
                />
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
                  startDate={stream.endTime}
                  minDate={stream.endTime}
                  dateFormat="MMM d, yyyy HH:mm"
                  autoComplete="off"
                  isClearable={false}
                />
              </div>
            </div>
            <div>
              <Checker.Connect type="button">
                <Checker.Network type="button" chainId={chainId}>
                  <Checker.Custom guardWhen={topUp && !amountAsEntity?.greaterThan(ZERO)} guardText="Enter amount">
                    <Checker.Custom guardWhen={changeEndDate && !endDate} guardText="Enter date">
                      <Checker.ApproveBentobox
                        tag={APPROVE_TAG}
                        type="button"
                        id="furo-update-stream-approve-bentobox"
                        chainId={chainId satisfies BentoBoxV1ChainId}
                        masterContract={contractAddress as Address}
                        className="col-span-3 md:col-span-2"
                      >
                        <Checker.ApproveERC20
                          id="approve-erc20-update-stream"
                          type="button"
                          amount={amountAsEntity}
                          contract={bentoBoxV1Address[chainId] as Address}
                          enabled={topUp}
                        >
                          <Checker.Success tag={APPROVE_TAG}>
                            <Button
                              type="button"
                              fullWidth
                              size="xl"
                              disabled={isWritePending || (!topUp && !changeEndDate) || !sendTransaction}
                              onClick={() => sendTransaction?.()}
                              testId="stream-update-confirmation"
                            >
                              {isWritePending ? <Dots>Confirm Update</Dots> : 'Update'}
                            </Button>
                          </Checker.Success>
                        </Checker.ApproveERC20>
                      </Checker.ApproveBentobox>
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
)
