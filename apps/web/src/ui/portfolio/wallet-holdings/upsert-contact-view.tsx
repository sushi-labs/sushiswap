import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button, DialogClose, DialogTitle, IconButton } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { shortenAddress } from 'sushi'
import { isAddress } from 'viem'
import { useContacts } from './hooks/useContacts'
import { useSendTokens } from './send-token-provider'

export const UpsertContactView = () => {
  const {
    mutate,
    state: { contactToEdit },
  } = useSendTokens()
  const { addContact, updateContact, hasContact } = useContacts()

  const [name, setName] = useState(contactToEdit?.name ?? '')
  const [address, setAddress] = useState(contactToEdit?.address ?? '')

  const isEditing = useMemo(() => {
    return contactToEdit?.address ? hasContact(contactToEdit.address) : false
  }, [contactToEdit?.address, hasContact])

  const isRecipientValid = useMemo(() => {
    return address ? isAddress(address) : false
  }, [address])

  const buttonText = useMemo(() => {
    if (!isRecipientValid && address) return 'Invalid Address'
    if (!address) return 'Enter Address'
    if (!name) return 'Enter Name'
    return isEditing ? 'Update' : 'Save'
  }, [isRecipientValid, address, name, isEditing])

  const handleSave = () => {
    const trimmedAddress = address.trim()
    const trimmedName = name.trim()

    if (!isAddress(trimmedAddress) || !trimmedName) return

    if (isEditing) {
      updateContact(trimmedAddress, trimmedName)
    } else {
      addContact({ address: trimmedAddress, name: trimmedName })
    }

    mutate.setContactToEdit(undefined)
    mutate.goTo('browseContacts')
  }
  return (
    <>
      <div className="flex justify-between items-center">
        <DialogTitle className="!font-medium !text-[20px] items-center !text-slate-900 dark:!text-slate-100">
          <div className="flex gap-2.5 items-center">
            <button type="button" onClick={() => mutate.goTo('browseContacts')}>
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            {isEditing ? 'Edit Contact' : 'Add Contact'}
          </div>
        </DialogTitle>
        <DialogClose>
          <IconButton variant="ghost" icon={XMarkIcon} name="Close" />
        </DialogClose>
      </div>

      <EditField label="Address" value={address} onChange={setAddress} />
      <EditField label="Name" value={name} onChange={setName} />

      <Button
        size="xl"
        variant={!isRecipientValid && address ? 'destructive' : 'default'}
        disabled={!isRecipientValid || !name}
        onClick={handleSave}
      >
        {buttonText}
      </Button>
    </>
  )
}

const EditField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 p-3 font-medium rounded-xl transition-colors duration-200 dark:bg-slate-900 bg-slate-100">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder={`Enter ${label}...`}
              className="p-0 m-0 w-full font-medium bg-transparent border-none outline-none focus:ring-0 text-[20px] !text-slate-900 dark:!text-slate-200 placeholder:text-slate-900 placeholder:dark:text-slate-200"
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
