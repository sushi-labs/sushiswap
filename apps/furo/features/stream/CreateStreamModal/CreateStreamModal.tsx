import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { ApprovalState, useApproveCallback } from 'hooks'
import { useBentoBoxApproveCallback } from 'hooks/useBentoBoxApproveCallback'
import { useFuroStreamContract } from 'hooks/useFuroStreamContract'
import { Amount, Token } from '@sushiswap/currency'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'
import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../actions'
import Button from '@sushiswap/ui/button/Button'
import { createToast } from 'components/Toast'
import { Dialog } from '@sushiswap/ui/dialog'
import { Typography } from '@sushiswap/ui'
import Dots from '@sushiswap/ui/dots/Dots'
import { TokenSelectorOverlay } from '.'
import Switch from '../../../../../packages/ui/switch/Switch'
import { JSBI } from '@sushiswap/math'
import { parseUnits } from 'ethers/lib/utils'
import { useTokenWalletBalance } from 'hooks/useTokenWalletBalance'
import Loader from '@sushiswap/ui/loader/Loader'
import { CurrencyInput } from 'components'

export const CreateStreamModal: FC = () => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const contract = useFuroStreamContract()
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<Token>()
  const [amount, setAmount] = useState<string>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>()
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [error, setError] = useState<string>()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  const amountAsEntity = useMemo(() => {
    if (!token || !amount) return undefined

    let value = undefined
    try {
      value = Amount.fromRawAmount(token, JSBI.BigInt(parseUnits(amount, token.decimals).toString()))
    } catch (e) {}

    return value
  }, [amount, token])

  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(open, contract?.address)
  const [tokenApprovalState, approveToken] = useApproveCallback(
    open,
    amountAsEntity,
    activeChain ? BENTOBOX_ADDRESS[activeChain?.id] : undefined,
  )

  const createStream = useCallback(async () => {
    if (!token || !amountAsEntity || !recipient || !startDate || !endDate || !contract || !account?.address) {
      console.log('missing required field', { token, amount, recipient, startDate, endDate })
      setError('Missing required field')
      return
    }

    setError(undefined)

    const actions = [
      approveBentoBoxAction({ contract, user: account.address, signature }),
      streamCreationAction({
        contract,
        recipient,
        token,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        amount: amountAsEntity,
        fromBentoBox,
      }),
    ]

    try {
      const data = await sendTransactionAsync({
        request: {
          from: account?.address,
          to: contract?.address,
          data: batchAction({ contract, actions }),
        },
      })

      createToast({
        title: 'Create stream',
        description: `You have successfully created a stream`,
        promise: data.wait(),
      })

      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    }
  }, [
    account?.address,
    amount,
    amountAsEntity,
    contract,
    endDate,
    fromBentoBox,
    recipient,
    sendTransactionAsync,
    signature,
    startDate,
    token,
  ])

  return (
    <>
      <Button variant="filled" color="blue" size="sm" onClick={() => setOpen(true)}>
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
              {/* TODO: Enable when bentoBalance hook is dialed in*/}
              {/*<div className="flex gap-2 items-center">*/}
              {/*  <Typography variant="xs">Use {fromBentoBox ? 'BentoBox' : 'Wallet'}</Typography>*/}
              {/*  <Switch*/}
              {/*    size="xs"*/}
              {/*    id="toggle-expert-mode-button"*/}
              {/*    checked={fromBentoBox}*/}
              {/*    onChange={() => setFromBentoBox((prevState) => !prevState)}*/}
              {/*    color="default"*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
          </div>
          <CurrencyInput onChange={setAmount} account={account?.address} amount={amount} token={token} />
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
          <div className="h-px bg-dark-800 my-2" />
          <div className="flex flex-col gap-4">
            {(bentoBoxApprovalState !== ApprovalState.APPROVED ||
              (token && tokenApprovalState !== ApprovalState.APPROVED)) && (
              <div className="flex flex-col gap-4 md:flex-row">
                {bentoBoxApprovalState !== ApprovalState.APPROVED && (
                  <Button variant="filled" color="blue" fullWidth disabled={!!signature} onClick={approveBentoBox}>
                    Approve Bentobox
                  </Button>
                )}
                {token && tokenApprovalState !== ApprovalState.APPROVED && (
                  <Button
                    variant="filled"
                    color="blue"
                    fullWidth
                    disabled={tokenApprovalState === ApprovalState.PENDING}
                    onClick={approveToken}
                  >
                    {tokenApprovalState === ApprovalState.PENDING ? (
                      <Dots>Approving {token?.symbol}</Dots>
                    ) : (
                      `Approve ${token?.symbol}`
                    )}
                  </Button>
                )}
              </div>
            )}
            <Button
              variant="filled"
              color="gradient"
              fullWidth
              disabled={
                isWritePending ||
                tokenApprovalState !== ApprovalState.APPROVED ||
                (bentoBoxApprovalState !== ApprovalState.APPROVED && !signature)
              }
              onClick={createStream}
            >
              {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create stream'}
            </Button>
            {error && (
              <Typography variant="xs" className="text-red text-center" weight={700}>
                {error}
              </Typography>
            )}
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
