import {
  ArrowLeftIcon,
  CheckIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  Button,
  ClipboardController,
  DialogClose,
  IconButton,
} from '@sushiswap/ui'
import { DialogTitle } from '@sushiswap/ui'
import { CopyIcon } from '@sushiswap/ui/icons/CopyIcon'
import { PencilIcon } from '@sushiswap/ui/icons/PencilIcon'
import { useState } from 'react'
import { shortenEvmAddress } from 'sushi/evm'
import { isAddress } from 'viem'
import { useContacts } from '../../../../../../../lib/wagmi/hooks/hooks/use-contacts'
import { useSendTokens } from './send-token-provider'

export const BrowseContactView = () => {
  const { mutate } = useSendTokens()
  const { contacts, deleteContact } = useContacts()

  return (
    <>
      <div className="flex justify-between items-center">
        <DialogTitle className="!font-medium !text-[20px] items-center !text-slate-900 dark:!text-slate-100">
          <div className="flex gap-2.5 items-center">
            <button type="button" onClick={() => mutate.goTo('send')}>
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            Browse Contact
          </div>
        </DialogTitle>
        <DialogClose>
          <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
        </DialogClose>
      </div>
      <div className="flex flex-col gap-3 max-h-[304px] overflow-y-auto hide-scrollbar">
        {Object.values(contacts).length === 0 ? (
          <div className="py-6 text-sm font-medium text-center text-muted-foreground">
            No contacts found.
          </div>
        ) : (
          Object.values(contacts).map((contact) => (
            <ContactItem
              key={contact.address}
              {...contact}
              goToEdit={() => {
                mutate.setContactToEdit(contact)
                mutate.goTo('editContact')
              }}
              deleteContact={() => {
                deleteContact(contact.address)
              }}
              setRawRecipientInput={() => {
                mutate.setRawRecipientInput(contact.address)
                mutate.goTo('send')
              }}
            />
          ))
        )}
      </div>

      <Button
        size="xl"
        variant={'default'}
        onClick={() => {
          mutate.goTo('addContact')
        }}
      >
        <PlusCircleIcon className="w-5 h-5" /> Add Contact
      </Button>
    </>
  )
}

export const ContactItem = ({
  name,
  address,
  goToEdit,
  deleteContact,
  setRawRecipientInput,
}: {
  name: string
  address: string
  goToEdit: () => void
  deleteContact: () => void
  setRawRecipientInput: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className="flex justify-between items-center p-3 font-medium rounded-xl transition-colors duration-200 dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-750"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={setRawRecipientInput}
      onKeyDown={setRawRecipientInput}
      type="button"
    >
      <div className="flex gap-3 items-center">
        <span>{name}</span>
        {isHovered && (
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goToEdit()
              }}
            >
              <PencilIcon className="w-5 h-5 text-blue dark:text-skyblue hover:text-blue-700 dark:hover:text-skyblue-600" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                deleteContact()
              }}
            >
              <TrashIcon className="w-5 h-5 text-blue dark:text-skyblue hover:text-blue-700 dark:hover:text-skyblue-600" />
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <span>
          {' '}
          {isAddress(address) ? shortenEvmAddress(address) : address}
        </span>
        <ClipboardController>
          {({ setCopied, isCopied }) =>
            isCopied ? (
              <CheckIcon className="w-6 cursor-pointer aspect-1 text-green" />
            ) : (
              <CopyIcon
                className="w-6 text-black cursor-pointer aspect-1 dark:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  setCopied(address)
                }}
              />
            )
          }
        </ClipboardController>
      </div>
    </button>
  )
}
