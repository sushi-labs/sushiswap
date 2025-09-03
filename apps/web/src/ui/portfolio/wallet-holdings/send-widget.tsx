import { PaperAirplaneIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  classNames,
} from '@sushiswap/ui'
import { useEffect, useMemo } from 'react'
import type { Type } from 'sushi/currency'
import { isAddress } from 'viem'
import { BrowseContactView } from './browse-contact-view'
import { useSendTokens } from './send-token-provider'
import { SendView } from './send-view'
import { UpsertContactView } from './upsert-contact-view'

export const SendWidget = ({
  triggerClassName,
  hideTriggerIcon = false,
  initialToken,
}: {
  triggerClassName?: string
  hideTriggerIcon?: boolean
  initialToken?: Type
}) => {
  const { state, mutate } = useSendTokens()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (initialToken) {
      mutate.setToken0(initialToken)
    }
  }, [initialToken])

  const isSendView = state.currentStep === 'send'
  const isBrowseView = state.currentStep === 'browseContacts'
  const isEditView = state.currentStep === 'editContact'
  const isAddView = state.currentStep === 'addContact'

  const isRecipientValid = useMemo(() => {
    if (!state.resolvedRecipientAddress) return false

    return isAddress(state.resolvedRecipientAddress)
  }, [state.resolvedRecipientAddress])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={classNames(
            '!min-h-[32px] !h-[32px] !p-3 font-semibold',
            triggerClassName,
          )}
          size="sm"
        >
          {!hideTriggerIcon && (
            <PaperAirplaneIcon className="mb-1 w-4 h-4 rotate-45" />
          )}
          Send
        </Button>
      </DialogTrigger>
      <DialogContent
        hideClose
        className={classNames(
          'max-w-none md:!max-w-[641px] !rounded-none md:!rounded-xl md:h-auto h-[100dvh] !flex flex-col !p-5',
          isBrowseView && 'md:!h-[470px]',
        )}
      >
        {isSendView && <SendView isRecipientValid={isRecipientValid} />}
        {isBrowseView && <BrowseContactView />}
        {(isEditView || isAddView) && (
          <UpsertContactView
            goBackTo={
              isEditView
                ? () => mutate.goTo('browseContacts')
                : () => mutate.goTo('send')
            }
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
