import { PaperAirplaneIcon } from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { isAddress } from 'viem'
import { RecentRecipients } from './recent-recipients'
import { RecipientInput } from './recipient-input'
import { SendTokenInput } from './send-token-input'
import { useSendTokens } from './send-token-provider'
import { VerifyContact } from './verify-contact'

export const SendWidget = () => {
  const { state } = useSendTokens()

  const isRecipientValid = useMemo(() => {
    if (!state.recipientAddress) return false
    console.log('recipientAddress', state.recipientAddress)

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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="!min-h-[32px] !h-[32px] !p-3 font-semibold"
          size="sm"
        >
          <PaperAirplaneIcon className="mb-1 w-4 h-4 rotate-45" />
          Send
        </Button>
      </DialogTrigger>
      <DialogContent hideClose className="!max-w-[641px]">
        <div className="items-center flex-justify-between">
          <DialogTitle>Send</DialogTitle>
          <DialogClose className="absolute top-2.5 right-2.5">
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
      </DialogContent>
    </Dialog>
  )
}
