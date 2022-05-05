import { Dialog } from '@headlessui/react' // TODO: should be imported from the ui, but that lib throws null
import { Stream } from 'features/context/Stream'
import { useToken } from 'hooks/Tokens'
import { STREAM_ADDRESS, useFuroStreamContract, useStreamBalance } from 'hooks/useFuroStreamContract'
import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { shortenAddress } from '@sushiswap/format'
import { JSBI } from '@sushiswap/math'
import { ChangeEvent, FC, useCallback, useState } from 'react'
import DialogContent from '@sushiswap/ui/dialog/DialogContent'
import { useAccount, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import Button from '../../../../packages/ui/button/Button'
import { UserIcon } from '@heroicons/react/outline'
import { AddressZero } from '@ethersproject/constants'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import Dots from '@sushiswap/ui/dots/Dots'
import { parseUnits } from 'ethers/lib/utils'

interface UpdateStreamModalProps {
  stream?: Stream
}

const UpdateStreamModal: FC<UpdateStreamModalProps> = ({ stream }) => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState<Amount<Token>>()
  const [newEndTime, setNewEndTime] = useState<Date>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const balance = useStreamBalance(stream?.id, stream?.token)

  const {
    data,
    write,
    isLoading: isWritePending,
  } = useContractWrite(
    {
      addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'cancelStream',
  )

  const { isLoading: isTxPending } = useWaitForTransaction({
    hash: data?.hash,
  })

  const updateStream = useCallback(() => {
    if (!stream || !amount || !newEndTime) return

    const difference = (newEndTime?.getTime() - stream?.endTime.getTime()) / 1000
    const topUpAmount = amount?.greaterThan(0) ? amount.toSignificant() : '0'

    return write({
      args: [BigNumber.from(stream.id), BigNumber.from(topUpAmount), difference > 0 ? difference : 0, fromBentoBox],
    })
  }, [amount, fromBentoBox, newEndTime, stream, write])

  const onInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isNaN(+e.target.value) || +e.target.value <= 0 || !stream?.token) {
        setAmount(undefined)
      } else {
        setAmount(
          Amount.fromRawAmount(stream.token, JSBI.BigInt(parseUnits(e.target.value, stream.token.decimals).toString())),
        )
      }
    },
    [stream?.token],
  )

  const handleBentoBoxCheck = () => {
    setFromBentoBox(!fromBentoBox)
  }

  const buttonText = isTxPending ? <Dots>Updating</Dots> : isWritePending ? <Dots>Confirm Update</Dots> : 'Update'

  return (
    <>
      <Button
        startIcon={<UserIcon width={18} height={18} />}
        fullWidth
        variant="outlined"
        color="gray"
        disabled={stream?.createdBy.id.toLocaleLowerCase() !== account?.address?.toLocaleLowerCase()}
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} className="absolute inset-0 overflow-y-auto">
        <div className="text-blue-600">
          <DialogContent>
            {stream && <div>Recipient: {shortenAddress(stream.recipient.id)}</div>}
            <div>
              Amount left: {stream && balance ? stream.amount.subtract(balance).toExact() : ''} {stream?.token.symbol}
            </div>
            <div>Start date: {stream?.startTime.toLocaleString()}</div>
            <div>End date: {stream?.endTime.toLocaleString()}</div>
            <div>
              Top up amount
              <input type="number" onChange={onInput} />
            </div>
            <div>
              from BentoBox: <input type="checkbox" defaultChecked={fromBentoBox} onChange={handleBentoBoxCheck} />
            </div>
            <div>
              Change end date
              <input
                type="datetime-local"
                // value={stream?.endTime.toISOString().substring(0, 16)}
                // min={minimumDate?.toISOString().substring(0, 16)}
                onChange={(e) => setNewEndTime(new Date(e.target.value))}
              />
            </div>
            <button onClick={updateStream}>{buttonText}</button>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}
export default UpdateStreamModal
