import { ArrowLeftIcon, CheckIcon, TrashIcon } from '@heroicons/react-v1/solid'
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
import { shortenAddress } from 'sushi/format'
import { useSendTokens } from './send-token-provider'

const CONTACTS = [
  {
    name: 'Vitalik Buterin',
    address: '0x1234567890123456789012345678901234567890',
  },
]

export const BrowseContactView = () => {
  const { mutate } = useSendTokens()

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
      <div className="flex flex-col gap-3">
        {CONTACTS.map((contact) => (
          <ContactItem
            key={contact.address}
            {...contact}
            goToEdit={() => mutate.goTo('editContact')}
          />
        ))}
      </div>
      <Button
        variant={'default'}
        onClick={() => {
          mutate.goTo('send')
        }}
      >
        Save
      </Button>
    </>
  )
}

export const ContactItem = ({
  name,
  address,
  goToEdit,
}: { name: string; address: string; goToEdit: () => void }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex justify-between items-center p-3 font-medium rounded-xl transition-colors duration-200 dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-750"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3 items-center">
        <span>{name}</span>
        {isHovered && (
          <div className="flex gap-2 items-center">
            <button type="button" onClick={goToEdit}>
              <PencilIcon className="w-5 h-5 text-blue dark:text-skyblue hover:text-blue-700 dark:hover:text-skyblue-600" />
            </button>
            <button type="button">
              <TrashIcon className="w-5 h-5 text-blue dark:text-skyblue hover:text-blue-700 dark:hover:text-skyblue-600" />
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <span>{shortenAddress(address)}</span>
        <ClipboardController>
          {({ setCopied, isCopied }) =>
            isCopied ? (
              <CheckIcon className="w-6 cursor-pointer aspect-1 text-green" />
            ) : (
              <CopyIcon
                className="w-6 cursor-pointer aspect-1"
                onClick={() => setCopied(address)}
              />
            )
          }
        </ClipboardController>
      </div>
    </div>
  )
}
