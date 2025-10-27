import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button, DialogClose, DialogTitle, IconButton } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { isAddress } from 'viem'
import { useChainId, useEnsAddress } from 'wagmi'
import { useContacts } from '../../../../../../../lib/wagmi/hooks/hooks/use-contacts'
import { useSendTokens } from './send-token-provider'

export const UpsertContactView = ({
  goBackTo,
}: {
  goBackTo: () => void
}) => {
  const {
    mutate,
    state: { contactToEdit },
  } = useSendTokens()
  const { addContact, updateContact, hasContact } = useContacts()

  const [name, setName] = useState(contactToEdit?.name ?? '')
  const [address, setAddress] = useState(contactToEdit?.address ?? '')

  const isENSName = address.endsWith('.eth')
  const chainId = useChainId()
  const { data: resolvedAddress } = useEnsAddress({
    name: isENSName ? address : undefined,
    chainId,
    query: {
      enabled: isENSName,
    },
  })

  const isRecipientValid = useMemo(() => {
    if (!resolvedAddress && !isAddress(address)) return false

    return isAddress(resolvedAddress || address)
  }, [resolvedAddress, address])

  const isEditing = useMemo(() => {
    return contactToEdit?.address ? hasContact(contactToEdit.address) : false
  }, [contactToEdit?.address, hasContact])

  const buttonText = useMemo(() => {
    if (!isRecipientValid && address) return 'Invalid Address'
    if (!address) return 'Enter Address'
    if (!name) return 'Enter Name'
    return isEditing ? 'Update' : 'Save'
  }, [isRecipientValid, address, name, isEditing])

  const handleSave = () => {
    const trimmedName = name.trim()
    const trimmedInput = address.trim()

    const isValid = isAddress(trimmedInput) || resolvedAddress

    if (!isValid || !trimmedName) return

    if (isEditing) {
      updateContact(trimmedInput, trimmedName)
    } else {
      addContact({ address: trimmedInput, name: trimmedName })
    }

    setName('')
    setAddress('')
    mutate.setContactToEdit(undefined)
    mutate.goTo('browseContacts')
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <DialogTitle className="!font-medium !text-[20px] items-center !text-slate-900 dark:!text-slate-100">
          <div className="flex gap-2.5 items-center">
            <button type="button" onClick={goBackTo}>
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
