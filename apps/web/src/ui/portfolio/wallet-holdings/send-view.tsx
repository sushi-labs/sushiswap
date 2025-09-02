import { XMarkIcon } from '@heroicons/react/24/outline'
import { DialogClose, DialogTitle, IconButton } from '@sushiswap/ui'
import { useMemo } from 'react'
import { isAddress } from 'viem'
import { RecentRecipients } from './recent-recipients'
import { RecipientInput } from './recipient-input'
import { SendButton } from './send-button'
import { SendDetails } from './send-details'
import { SendTokenInput } from './send-token-input'
import { useSendTokens } from './send-token-provider'
import { VerifyContact } from './verify-contact'

export const SendView = () => {
  const { state } = useSendTokens()

  const isRecipientValid = useMemo(() => {
    if (!state.recipientAddress) return false

    return isAddress(state.recipientAddress)
  }, [state.recipientAddress])

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
          <SendTokenInput />
          <RecipientInput isRecipientValid={isRecipientValid} />
          <VerifyContact
            address={state.recipientAddress}
            isRecipientValid={isRecipientValid}
          />
        </div>
      </div>
      <RecentRecipients />
      <SendButton isRecipientValid={isRecipientValid} />
      <SendDetails isRecipientValid={isRecipientValid} />
    </>
  )
}
