import { PlusCircleIcon } from '@heroicons/react-v1/solid'
import { Button } from '@sushiswap/ui'
import { useContacts } from './hooks/useContacts'
import { useSendTokens } from './send-token-provider'

export const VerifyContact = ({ address }: { address: string }) => {
  const { mutate } = useSendTokens()
  const { hasContact } = useContacts()

  const isContact = hasContact(address)

  if (isContact || !address) return null

  return (
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
          mutate.goTo('editContact')
        }}
      >
        <PlusCircleIcon className="w-4 h-4" />
        <span>Add Contact</span>
      </Button>
    </div>
  )
}
