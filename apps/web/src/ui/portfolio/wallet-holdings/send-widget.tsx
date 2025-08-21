import { PaperAirplaneIcon } from '@heroicons/react-v1/solid'
import { Button, Dialog, DialogContent, DialogTrigger } from '@sushiswap/ui'
import { BrowseContactView } from './browse-contact-view'
import { EditContactView } from './edit-contact-view'
import { useSendTokens } from './send-token-provider'
import { SendView } from './send-view'

export const SendWidget = () => {
  const { state } = useSendTokens()

  const isSendView = state.currentStep === 'send'
  const isBrowseView = state.currentStep === 'browseContacts'
  const isEditView = state.currentStep === 'editContact'

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
        {isSendView && <SendView />}
        {isBrowseView && <BrowseContactView />}
        {isEditView && <EditContactView />}
      </DialogContent>
    </Dialog>
  )
}
