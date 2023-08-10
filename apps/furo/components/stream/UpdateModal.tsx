import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { PencilIcon } from '@heroicons/react/outline'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Amount, Token } from '@sushiswap/currency'
import { FuroStreamChainId } from '@sushiswap/furo'
import { JSBI, ZERO } from '@sushiswap/math'
import {
  DateField,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTrigger,
  Label,
  TextField,
} from '@sushiswap/ui'
import { DialogTitle } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { Switch } from '@sushiswap/ui/components/switch'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  _useSendTransaction as useSendTransaction,
  Address,
  useAccount,
  useContract,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems/Checker'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'

import { approveBentoBoxAction, batchAction, Stream } from '../../lib'

const APPROVE_TAG = 'updateStreamSingle'

interface UpdateModalProps {
  stream: Stream
  abi: NonNullable<Parameters<typeof useContract>['0']>['abi']
  address: string
  chainId: FuroStreamChainId
}

export const UpdateModal: FC<UpdateModalProps> = withCheckerRoot(
  ({ stream, abi, address: contractAddress, chainId }) => {
    const { address } = useAccount()
    const { approved } = useApproved(APPROVE_TAG)
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

    const {
      sendTransactionAsync,
      isLoading: isWritePending,
      data,
    } = useSendTransaction({
      chainId,
      prepare,
      onSettled,
      onSuccess() {
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

    const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

    return (
      <DialogProvider>
        <DialogReview modal={true}>
          {({ confirm }) => (
            <>
              <DialogTrigger asChild>
                <Button id="stream-update" icon={PencilIcon} variant="secondary" disabled={!stream?.canUpdate(address)}>
                  Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update stream</DialogTitle>
                  <DialogDescription>Update the stream to change the amount or end date.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label>Top up</Label>
                      <Switch
                        testdata-id="update-amount-switch"
                        checked={topUp}
                        onCheckedChange={() => setTopUp((prevState) => !prevState)}
                      />
                    </div>
                    {topUp ? (
                      <TextField
                        type="number"
                        value={amount}
                        onValueChange={setAmount}
                        testdata-id="furo-stream-top-up"
                        unit={stream.token.symbol}
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label>Change duration</Label>
                      <Switch
                        testdata-id="update-end-date-switch"
                        checked={changeEndDate}
                        onCheckedChange={() => setChangeEndDate((prevState) => !prevState)}
                      />
                    </div>
                    {changeEndDate ? (
                      <DateField
                        testId="stream-update-end-date"
                        onChange={setEndDate}
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
                        placeholderText="End date"
                      />
                    ) : null}
                  </div>
                </div>
                <DialogFooter>
                  <Checker.Connect type="button">
                    <Checker.Network type="button" chainId={chainId}>
                      <Checker.Guard guardWhen={topUp && !amountAsEntity?.greaterThan(ZERO)} guardText="Enter amount">
                        <Checker.Guard guardWhen={changeEndDate && !endDate} guardText="Enter date">
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
                                  disabled={isWritePending || (!topUp && !changeEndDate) || !sendTransactionAsync}
                                  onClick={() => sendTransactionAsync?.().then(() => confirm())}
                                  testId="stream-update-confirmation"
                                >
                                  {isWritePending ? <Dots>Confirm Update</Dots> : 'Update'}
                                </Button>
                              </Checker.Success>
                            </Checker.ApproveERC20>
                          </Checker.ApproveBentobox>
                        </Checker.Guard>
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
          testId="update-stream-confirmation-modal"
          successMessage={`Successfully updated stream`}
          txHash={data?.hash}
        />
      </DialogProvider>
    )
  }
)
