import { PlusCircleIcon } from '@heroicons/react-v1/solid'
import { Button, Collapsible } from '@sushiswap/ui'
import { useContacts } from '../../../lib/wagmi/hooks/hooks/use-contacts'
import { useSendTokens } from './send-token-provider'

export const VerifyContact = ({
  address,
  isRecipientValid,
}: { address: string; isRecipientValid: boolean }) => {
  const { mutate } = useSendTokens()
  const { hasContact } = useContacts()

  const isContact = hasContact(address)

  return (
    <Collapsible open={isRecipientValid && !isContact}>
      <div className="flex justify-between items-center -mt-2 -mb-1">
        <span className="text-sm font-medium text-muted-foreground">
          This address is not in your contact. Please review carefully.
        </span>
        <Button
          variant="ghost"
          size="default"
          className="!text-blue !gap-1"
          onClick={() => {
            mutate.setContactToEdit({ address, name: '' })
            mutate.goTo('addContact')
          }}
        >
          <PlusCircleIcon className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
      </div>
    </Collapsible>
  )
}
