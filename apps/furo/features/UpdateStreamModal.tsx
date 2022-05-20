import { CheckIcon, PencilIcon, XIcon } from '@heroicons/react/outline'
import { Amount } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { JSBI } from '@sushiswap/math'
import { Button, classNames, Dialog, Dots, Switch, Typography } from '@sushiswap/ui'
import { createToast, CurrencyInput } from 'components'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Stream } from 'features/context/Stream'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'

interface UpdateStreamModalProps {
  stream?: Stream
  abi: object
  address: string
}

const UpdateStreamModal: FC<UpdateStreamModalProps> = ({ stream, abi, address }) => {
  const { data: account } = useAccount()
  const [open, setOpen] = useState(false)
  const [topUp, setTopUp] = useState(false)
  const [changeEndDate, setChangeEndDate] = useState(false)
  const [amount, setAmount] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [fromBentoBox, setFromBentoBox] = useState(false)
  const [error, setError] = useState<string>()

  const amountAsEntity = useMemo(() => {
    if (!stream || !amount) return undefined

    let value = undefined
    try {
      value = Amount.fromRawAmount(stream.token, JSBI.BigInt(parseUnits(amount, stream.token.decimals).toString()))
    } catch (e) {}

    return value
  }, [amount, stream])

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: address,
      contractInterface: abi,
    },
    'updateStream',
    {
      onSuccess() {
        setOpen(false)
      },
    },
  )

  const updateStream = useCallback(async () => {
    if (!stream) return
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

      createToast({
        title: 'Update stream',
        description: `You have successfully updated your stream`,
        promise: data.wait(),
      })
    } catch (e: any) {
      setError(e.message)
    }
  }, [amount, amountAsEntity, changeEndDate, endDate, fromBentoBox, stream, topUp, writeAsync])

  if (!stream) return null

  return (
    <>
      <Button
        startIcon={<PencilIcon width={18} height={18} />}
        fullWidth
        color="gray"
        onClick={() => setOpen(true)}
        disabled={account?.address && !stream?.canUpdate(account.address)}
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
              <Typography variant="sm" weight={700} className="text-slate-200">
                {shortenAddress(stream.recipient.id)}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="xs" weight={500} className="text-slate-500">
                Stream Amount
              </Typography>
              <Typography variant="sm" weight={700} className="text-slate-200">
                {stream.amount.toSignificant(6)}{' '}
                <span className="font-medium text-slate-500">{stream.token.symbol}</span>
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="xs" weight={500} className="text-slate-500">
                Start date
              </Typography>
              <Typography variant="sm" weight={700} className="text-slate-200">
                {stream.startTime.toLocaleString()}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="xs" weight={500} className="text-slate-500">
                End date
              </Typography>
              <Typography variant="sm" weight={700} className="text-slate-200">
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
                color="gradient"
                uncheckedIcon={<XIcon />}
                checkedIcon={<CheckIcon />}
              />
            </div>
            <CurrencyInput
              className={classNames(topUp ? '' : 'opacity-40 pointer-events-none')}
              onChange={setAmount}
              token={stream.token}
              amount={amount}
              account={account?.address}
            />
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
                color="gradient"
                uncheckedIcon={<XIcon />}
                checkedIcon={<CheckIcon />}
              />
            </div>
            <input
              type="datetime-local"
              className={classNames(
                changeEndDate ? '' : 'opacity-40 pointer-events-none',
                'rounded-xl bg-slate-800 py-3 px-4 text-left shadow-md border-none text-sm font-bold',
              )}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button variant="filled" color="gradient" fullWidth disabled={isWritePending} onClick={updateStream}>
            {isWritePending ? <Dots>Confirm Update</Dots> : 'Update'}
          </Button>
          {error && (
            <Typography variant="xs" className="text-center text-red" weight={700}>
              {error}
            </Typography>
          )}
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default UpdateStreamModal
