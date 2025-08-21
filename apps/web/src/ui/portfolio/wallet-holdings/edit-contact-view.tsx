import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button, DialogClose, DialogTitle, IconButton } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { shortenAddress } from 'sushi'
import { isAddress } from 'viem'
import { useSendTokens } from './send-token-provider'

export const EditContactView = () => {
  const { mutate } = useSendTokens()
  const [name, setName] = useState('Vitalik Buterin')
  const [address, setAddress] = useState(
    '0x38A6f57BD9B8E8f2fE1D69C6a3B9367BFC9B2f40',
  )

  const isRecipientValid = useMemo(() => {
    if (!address) return false

    return isAddress(address)
  }, [address])

  const buttonText = useMemo(() => {
    if (!isRecipientValid && address) return 'Invalid Address'
    if (!address) return 'Enter Address'
    if (!name) return 'Enter Name'

    return 'Save'
  }, [isRecipientValid, address, name])

  return (
    <>
      <div className="flex justify-between items-center">
        <DialogTitle className="!font-medium !text-[20px] items-center !text-slate-900 dark:!text-slate-100">
          <div className="flex gap-2.5 items-center">
            <button type="button" onClick={() => mutate.goTo('browseContacts')}>
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            Edit Contact
          </div>
        </DialogTitle>
        <DialogClose>
          <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
        </DialogClose>
      </div>
      <EditField
        label="Address"
        value={address}
        onChange={(value) => setAddress(value)}
      />
      <EditField
        label="Name"
        value={name}
        onChange={(value) => setName(value)}
      />

      <Button
        variant={!isRecipientValid && address ? 'destructive' : 'default'}
        disabled={!(isRecipientValid && address) || !name || !address}
        onClick={() => {
          mutate.goTo('browseContacts')
        }}
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
        <div className="flex flex-col gap-4 p-3 font-medium rounded-xl transition-colors duration-200 dark:bg-slate-800 bg-slate-100">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Enter Address..."
              className="p-0 m-0 w-full font-medium bg-transparent border-none outline-none focus:ring-0 text-[20px]"
              value={value}
              onChange={(e) => {
                console.log(`[EditField] Input changed: ${e.target.value}`)
                onChange(e.target.value)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
