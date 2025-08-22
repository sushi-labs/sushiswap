import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button, DialogClose, DialogTitle, IconButton } from '@sushiswap/ui'
import { useMemo } from 'react'
import { isAddress } from 'viem'
import { useAmountBalances } from '~evm/_common/ui/balance-provider/use-balances'
import { RecentRecipients } from './recent-recipients'
import { RecipientInput } from './recipient-input'
import { SendTokenInput } from './send-token-input'
import { useSendTokens } from './send-token-provider'
import { VerifyContact } from './verify-contact'

export const SendView = () => {
  const { state } = useSendTokens()

  // const { data: balances } = useAmountBalances(state.token0?.chainId, [state.token0])

  const isRecipientValid = useMemo(() => {
    if (!state.recipientAddress) return false

    return isAddress(state.recipientAddress)
  }, [state.recipientAddress])

  const buttonText = useMemo(() => {
    if (!state?.token0) {
      return 'Select a token'
    }
    if (!state.amount) {
      return 'Enter Amount'
    }
    if (!state.recipientAddress) {
      return 'Enter Recipient'
    }
    if (!isRecipientValid) {
      return 'Invalid recipient'
    }
    return 'Send'
  }, [state.token0, state.amount, state.recipientAddress, isRecipientValid])

  return (
    <>
      <div className="flex justify-between items-center">
        <DialogTitle className="!font-medium !text-[20px] !text-slate-900 dark:!text-slate-100">
          Send
        </DialogTitle>
        <DialogClose>
          <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
        </DialogClose>
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <SendTokenInput currency={state.token0} />
          <RecipientInput isRecipientValid={isRecipientValid} />
          <VerifyContact />
        </div>
      </div>
      <RecentRecipients />
      <Button
        variant={
          !isRecipientValid && state.recipientAddress
            ? 'destructive'
            : 'default'
        }
        disabled={
          !state.token0 ||
          !state.amount ||
          !state.recipientAddress ||
          state.amount === '0' ||
          !isRecipientValid
        }
      >
        {buttonText}
      </Button>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Network fee</span>
          <div className="flex gap-0.5">
            <span>(~$90.23)</span>
            <span className="font-medium">0.003 ETH</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Estimated Time</span>
          <div className="flex gap-0.5">
            <span className="font-medium">5 seconds</span>
          </div>
        </div>
      </div>
    </>
  )
}
