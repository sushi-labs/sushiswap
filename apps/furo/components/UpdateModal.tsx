import { BigNumber } from '@ethersproject/bignumber'
import { ContractInterface } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import { CheckIcon, PencilIcon, XIcon } from '@heroicons/react/outline'
import { Amount } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { JSBI } from '@sushiswap/math'
import { Button, classNames, createToast, Dialog, Dots, Switch, Typography } from '@sushiswap/ui'
import { CurrencyInput } from 'components'
import { Stream } from 'lib'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useDeprecatedContractWrite, useNetwork } from 'wagmi'

interface UpdateModalProps {
  stream?: Stream
  abi: ContractInterface
  address: string
}

export const UpdateModal: FC<UpdateModalProps> = ({ stream, abi, address: contractAddress }) => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [topUp, setTopUp] = useState(false)
  const [changeEndDate, setChangeEndDate] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [endDate, setEndDate] = useState<string>()
  const [fromBentoBox, setFromBentoBox] = useState(false)
  const [error, setError] = useState<string>()

  const amountAsEntity = useMemo(() => {
    if (!stream || !amount) return undefined

    let value = undefined
    try {
      value = Amount.fromRawAmount(stream.token, JSBI.BigInt(parseUnits(amount, stream.token.decimals).toString()))
    } catch (e) {
      console.debug(e)
    }

    return value
  }, [amount, stream])

  const { writeAsync, isLoading: isWritePending } = useDeprecatedContractWrite({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: 'updateStream',
    onSuccess() {
      setOpen(false)
    },
  })

  const updateStream = useCallback(async () => {
    if (!stream || !activeChain?.id) return
    if (topUp && !amount) return
    if (changeEndDate && !endDate) return

    setError(undefined)

    const difference = (new Date(endDate as string)?.getTime() - stream?.endTime.getTime()) / 1000
    const topUpAmount = amountAsEntity?.greaterThan(0) ? amountAsEntity.quotient.toString() : '0'

    try {
      const data = await writeAsync({
        args: [
          BigNumber.from(stream.id),
          BigNumber.from(topUp ? topUpAmount : '0'),
          changeEndDate ? difference : 0,
          fromBentoBox,
        ],
      })

      const ts = new Date().getTime()
      createToast({
        type: 'updateStream',
        txHash: data.hash,
        chainId: activeChain.id,
        timestamp: ts,
        groupTimestamp: ts,
        promise: data.wait(),
        summary: {
          pending: <Dots>Updating stream</Dots>,
          completed: `Successfully updated stream`,
          failed: 'Something went wrong updating the stream',
        },
      })
    } catch (e: any) {
      setError(e.message)
    }
  }, [activeChain?.id, amount, amountAsEntity, changeEndDate, endDate, fromBentoBox, stream, topUp, writeAsync])

  if (!stream || !address || !stream?.canUpdate(address)) return null

  return (
    <>
      <Button
        color="gray"
        fullWidth
        startIcon={<PencilIcon width={18} height={18} />}
        onClick={() => setOpen(true)}
        disabled={!address || !stream?.canUpdate(address)}
      >
        Update
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="!space-y-6 !max-w-sm">
          <Dialog.Header title="Update Stream" onClose={() => setOpen(false)} />
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <Typography variant="xs" weight={500} className="text-slate-500">
                Recipient
              </Typography>
              <Typography variant="sm" weight={500} className="text-slate-200">
                {shortenAddress(stream.recipient.id)}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="xs" weight={500} className="text-slate-500">
                Stream Amount
              </Typography>
              <Typography variant="sm" weight={500} className="text-slate-200">
                {stream.remainingAmount.toSignificant(6)}{' '}
                <span className="font-medium text-slate-500">{stream.token.symbol}</span>
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="xs" weight={500} className="text-slate-500">
                Start date
              </Typography>
              <Typography variant="sm" weight={500} className="text-slate-200">
                {stream.startTime.toLocaleString()}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="xs" weight={500} className="text-slate-500">
                End date
              </Typography>
              <Typography variant="sm" weight={500} className="text-slate-200">
                {stream.endTime.toLocaleString()}
              </Typography>
            </div>
          </div>
          <div className="h-px my-2 bg-slate-800" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 pb-2">
              <Typography variant="sm" weight={500} className="text-slate-200">
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
              <Typography variant="sm" weight={500} className="text-slate-200">
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
            <input
              type="datetime-local"
              className={classNames(
                changeEndDate ? '' : 'opacity-40 pointer-events-none',
                'rounded-xl bg-slate-800 py-3 px-4 text-left shadow-md border-none text-sm font-medium'
              )}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {error && (
            <Typography variant="xs" className="text-center text-red" weight={500}>
              {error}
            </Typography>
          )}
          <Dialog.Actions>
            <Button variant="filled" color="gradient" fullWidth disabled={isWritePending} onClick={updateStream}>
              {isWritePending ? <Dots>Confirm Update</Dots> : 'Update'}
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
