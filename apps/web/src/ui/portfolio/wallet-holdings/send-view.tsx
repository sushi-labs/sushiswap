import { XMarkIcon } from '@heroicons/react/24/outline'
import { DialogClose, DialogTitle, IconButton } from '@sushiswap/ui'
import { RecentRecipients } from './recent-recipients'
import { RecipientInput } from './recipient-input'
import { SendButton } from './send-button'
import { SendDetails } from './send-details'
import { SendTokenInput } from './send-token-input'
import { useSendTokens } from './send-token-provider'
import { VerifyContact } from './verify-contact'

export const SendView = ({
  isRecipientValid,
}: {
  isRecipientValid: boolean
}) => {
  const { state } = useSendTokens()

  const isENSName = state.rawRecipientInput.endsWith('.eth')
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
            address={
              isENSName
                ? state.rawRecipientInput
                : state.resolvedRecipientAddress
            }
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
