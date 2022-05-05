import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { useApproveCallback, ApprovalState } from 'hooks'
import { useAllTokens } from 'hooks/Tokens'
import { useBentoBoxApproveCallback } from 'hooks/useBentoBoxApproveCallback'
import { useFuroStreamContract } from 'hooks/useFuroStreamContract'
import { Token } from '@sushiswap/currency'
import { FC, useCallback, useRef, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'
import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../actions'
import Button from '@sushiswap/ui/button/Button'
import { createToast } from 'components/Toast'
import { Dialog } from '@sushiswap/ui/dialog'
import { Typography } from '@sushiswap/ui'
import Dots from '@sushiswap/ui/dots/Dots'
import { TokenSelectorOverlay } from '.'
import Switch from '../../../../../packages/ui/switch/Switch'

export const CreateStreamModal: FC = () => {
  const contract = useFuroStreamContract()
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<Token>()
  const [amount, setAmount] = useState<string>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>()
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()
  const amountInputRef = useRef<HTMLInputElement>(null)

  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(open, contract?.address)
  const [tokenApprovalState, approveToken] = useApproveCallback(
    open,
    amount,
    activeChain ? BENTOBOX_ADDRESS[activeChain?.id] : undefined,
  )

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
        <Dialog.Content className="!space-y-6 !max-w-md relative overflow-hidden">
          <Dialog.Header title="Create Stream" onClose={() => setOpen(false)} />
          <TokenSelectorOverlay currency={token} onSelect={setToken} />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-1">
              <Typography variant="sm" weight={500} className="text-high-emphesis">
                Amount
              </Typography>
              <div className="flex gap-2 items-center">
                <Typography variant="xs">Use {fromBentoBox ? 'BentoBox' : 'Wallet'}</Typography>
                <Switch
                  size="xs"
                  id="toggle-expert-mode-button"
                  checked={fromBentoBox}
                  onChange={() => setFromBentoBox((prevState) => !prevState)}
                  color="default"
                />
              </div>
            </div>
            <div
              aria-hidden="true"
              onClick={() => amountInputRef.current?.focus()}
              className="flex flex-col rounded-xl bg-dark-800 focus:ring-1 focus-within:ring-1 ring-offset-2 ring-offset-dark-900 ring-blue shadow-md"
            >
              <div className="flex justify-between items-center gap-1">
                <input
                  ref={amountInputRef}
                  value={amount}
                  type="text"
                  placeholder="0.00"
                  className="px-4 text-left shadow-md border-none text-lg font-bold bg-transparent !ring-0 shadow-none"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Typography variant="sm" weight={700} className="pr-4 text-secondary">
                  {token?.symbol}
                </Typography>
              </div>
              <div className="flex justify-between px-4 pb-3">
                <Typography variant="xs" weight={500} className="text-secondary">
                  Balance
                </Typography>
                <Typography variant="xs" weight={500} className="text-secondary" onClick={() => setAmount('0.003')}>
                  0.003 {token?.symbol}
                </Typography>
              </div>
            </div>
          </div>
          <div className="h-px bg-dark-800 my-2" />
          <div className="flex flex-col gap-2">
            <Typography variant="sm" weight={500} className="text-high-emphesis">
              Recipient (ENS name or Address)
            </Typography>
            <input
              placeholder="0x..."
              type="text"
              className="rounded-xl bg-dark-800 py-3 pl-4 pr-10 text-left shadow-md border-none text-sm font-bold"
              defaultValue={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Typography variant="sm" weight={500} className="text-high-emphesis">
                Start date
              </Typography>
              <input
                type="datetime-local"
                className="rounded-xl bg-dark-800 py-3 px-4 text-left shadow-md border-none text-sm font-bold"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="sm" weight={500} className="text-high-emphesis">
                End date
              </Typography>
              <input
                type="datetime-local"
                className="rounded-xl bg-dark-800 py-3 px-4 text-left shadow-md border-none text-sm font-bold"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <Button variant="filled" color="gradient" fullWidth disabled={isWritePending} onClick={createStream}>
            {isWritePending ? <Dots>Confirm Cancel</Dots> : 'Create stream'}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
