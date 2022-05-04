import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { useApproveCallback, ApprovalState } from 'hooks'
import { useAllTokens } from 'hooks/Tokens'
import { useBentoBoxApproveCallback } from 'hooks/useBentoBoxApproveCallback'
import { useFuroStreamContract } from 'hooks/useFuroStreamContract'
import { Amount, Token } from '@sushiswap/currency'
import { FC, useCallback, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'
import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../actions'
import Button from '@sushiswap/ui/button/Button'
import { createToast } from 'components/Toast'
import { Dialog } from '@sushiswap/ui/dialog'
import { Listbox } from '@headlessui/react'
import { Typography, Select, WalletIcon, BentoboxIcon } from '@sushiswap/ui'
import { CheckIcon, SelectorIcon, XIcon } from '@heroicons/react/outline'
import Switch from '@sushiswap/ui/switch/Switch'
import Dots from '@sushiswap/ui/dots/Dots'
import { TokenSelectorOverlay } from '.'

export const CreateStreamModal: FC = () => {
  const contract = useFuroStreamContract()
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<Token>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>()
  const [duration, setDuration] = useState<number>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  // const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(open, contract?.address)
  // const [tokenApprovalState, approveToken] = useApproveCallback(
  //   open,
  //   amount,
  //   activeChain ? BENTOBOX_ADDRESS[activeChain?.id] : undefined,
  // )

  const createStream = useCallback(async () => {
    if (!token || !amount || !recipient || !startDate || !endDate || !contract || !account?.address) {
      console.log('missing required field', { token, amount, recipient, startDate, endDate })
      return
    }

    const actions = [
      approveBentoBoxAction({ contract, user: account.address, signature }),
      streamCreationAction({ contract, recipient, token, startDate, endDate, amount, fromBentoBox }),
    ]

    const data = await sendTransactionAsync({
      request: {
        from: account?.address,
        to: contract?.address,
        data: batchAction({ contract, actions }),
      },
    })

    createToast({
      title: 'Cancel stream',
      description: `You have successfully cancelled your stream`,
      promise: data.wait(),
    })
  }, [
    account?.address,
    amount,
    contract,
    endDate,
    fromBentoBox,
    recipient,
    sendTransactionAsync,
    // signature,
    startDate,
    token,
  ])

  // const ApproveTokenButton: FC = () => {
  //   return tokenApprovalState === ApprovalState.NOT_APPROVED ? (
  //     <button onClick={approveToken}>{`Approve ${token.symbol}`}</button>
  //   ) : tokenApprovalState === ApprovalState.PENDING ? (
  //     <button disabled={true}>{`Approving Token`}</button>
  //   ) : (
  //     <></>
  //   )
  // }
  //
  // const SignBentoBox: FC = () => {
  //   return bentoBoxApprovalState === ApprovalState.NOT_APPROVED ? (
  //     <button onClick={approveBentoBox}>{`Approve BentoBox`}</button>
  //   ) : tokenApprovalState === ApprovalState.PENDING ? (
  //     <button disabled={true}>{`Approving BentoBox`}</button>
  //   ) : (
  //     <></>
  //   )
  // }

  return (
    <>
      <Button variant="filled" color="blue" onClick={() => setOpen(true)}>
        Create stream
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="!space-y-6 !max-w-sm relative">
          <Dialog.Header title="Create Stream" onClose={() => setOpen(false)} />
          <div className="flex gap-3">
            <TokenSelectorOverlay currency={token} onSelect={setToken} />
            <Select
              onChange={setFromBentoBox}
              button={<Select.Button>Wallet</Select.Button>}
              label={<Select.Label>From</Select.Label>}
            >
              <Select.Options>
                <Select.Option value={false}>Wallet</Select.Option>
                <Select.Option value={true}>BentoBox</Select.Option>
              </Select.Options>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="sm" weight={500} className="text-high-emphesis">
              Amount to stream
            </Typography>
            <input
              type="number"
              placeholder="0.00"
              className="rounded-xl bg-dark-800 py-3 pl-4 pr-10 text-left shadow-md border-none text-sm font-bold"
              onChange={(e) => setAmount(Amount.fromRawAmount(token, parseInt(e.target.value)))}
            />
          </div>
          <div className="h-px bg-dark-800 my-2" />
          <div className="flex flex-col gap-2">
            <Typography variant="sm" weight={500} className="text-high-emphesis">
              Recipient (ENS name or Address)
            </Typography>
            <input
              type="text"
              className="rounded-xl bg-dark-800 py-3 pl-4 pr-10 text-left shadow-md border-none text-sm font-bold"
              defaultValue={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="sm" weight={500} className="text-high-emphesis">
              Stream duration
            </Typography>
            <input
              type="text"
              placeholder="30 days"
              className="rounded-xl bg-dark-800 py-3 pl-4 pr-10 text-left shadow-md border-none text-sm font-bold"
              defaultValue={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <Button variant="filled" color="gradient" fullWidth disabled={isWritePending} onClick={createStream}>
            {isWritePending ? <Dots>Confirm Cancel</Dots> : 'Create stream'}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
