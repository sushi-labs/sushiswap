import { PlusIcon } from '@heroicons/react/solid'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, ZERO } from '@sushiswap/math'
import { Button, Dialog, Dots, Input, Switch, Typography } from '@sushiswap/ui'
import { createToast, CurrencyInput } from 'components'
import { parseUnits } from 'ethers/lib/utils'
import { TokenSelectorOverlay } from 'features/stream'
import { ApprovalState, useApproveCallback, useBentoBoxApproveCallback, useFuroStreamContract } from 'hooks'
import { useFundSourceToggler } from 'hooks/useFundSourceToggler'
import { cloneElement, FC, ReactElement, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'

import { approveBentoBoxAction, batchAction, streamCreationAction } from '../../actions'

interface CreateStreamModal {
  button?: ReactElement
}

export const CreateStreamModal: FC<CreateStreamModal> = ({ button }) => {
  const [open, setOpen] = useState(false)
  return <CreateStreamModalControlled open={open} setOpen={setOpen} button={button} />
}

interface CreateStreamModalControlledProps extends CreateStreamModal {
  open: boolean
  setOpen(open: boolean): void
}

export const CreateStreamModalControlled: FC<CreateStreamModalControlledProps> = ({ button, open, setOpen }) => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const contract = useFuroStreamContract()
  const [token, setToken] = useState<Token>()
  const [amount, setAmount] = useState<string>()
  const { value: fundSource, fromBentobox, toggle } = useFundSourceToggler()
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
        fromBentobox,
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
    fromBentobox,
    recipient,
    sendTransactionAsync,
    setOpen,
    signature,
    startDate,
    token,
  ])

  return (
    <>
      {button ? (
        cloneElement(button, { onClick: () => setOpen(true) })
      ) : (
        <Button
          startIcon={<PlusIcon width={18} height={18} />}
          variant="filled"
          color="blue"
          size="sm"
          onClick={() => setOpen(true)}
          className="rounded-xl"
        >
          New stream
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="!space-y-6 !max-w-md relative overflow-hidden border border-slate-700">
          <Dialog.Header title="Create Stream" onClose={() => setOpen(false)} />
          <TokenSelectorOverlay currency={token} onSelect={setToken} />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-1">
              <Typography variant="sm" weight={500} className="text-slate-200">
                Amount
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="xs">Use {fromBentobox ? 'BentoBox' : 'Wallet'}</Typography>
                <Switch
                  size="xs"
                  id="toggle-expert-mode-button"
                  checked={fromBentobox}
                  onChange={toggle}
                  color="default"
                />
              </div>
            </div>
            <CurrencyInput
              onChange={setAmount}
              account={account?.address}
              amount={amount}
              token={token}
              fundSource={fundSource}
            />
          </div>
          <div className="h-px my-2 bg-slate-800" />
          <div className="flex flex-col gap-2">
            <Typography variant="sm" weight={500} className="text-slate-200">
              Recipient (ENS name or Address)
            </Typography>
            <Input.Address placeholder="0x..." value={recipient} onChange={setRecipient} />
          </div>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Typography variant="sm" weight={500} className="text-slate-200">
                Start date
              </Typography>
              <Input.DatetimeLocal value={startDate} onChange={setStartDate} />
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="sm" weight={500} className="text-slate-200">
                End date
              </Typography>
              <Input.DatetimeLocal value={endDate} onChange={setEndDate} />
            </div>
          </div>
          <div className="h-px my-2 bg-slate-800" />
          <div className="flex flex-col gap-4">
            {(bentoBoxApprovalState !== ApprovalState.APPROVED ||
              (token && [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(tokenApprovalState))) && (
              <div className="flex flex-col gap-4 md:flex-row">
                {bentoBoxApprovalState !== ApprovalState.APPROVED && (
                  <Button variant="filled" color="blue" fullWidth disabled={!!signature} onClick={approveBentoBox}>
                    Approve Bentobox
                  </Button>
                )}
                {token && [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(tokenApprovalState) && (
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
                (bentoBoxApprovalState !== ApprovalState.APPROVED && !signature) ||
                !amountAsEntity?.greaterThan(ZERO)
              }
              onClick={createStream}
            >
              {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create stream'}
            </Button>
            {error && (
              <Typography variant="xs" className="text-center text-red" weight={700}>
                {error}
              </Typography>
            )}
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
