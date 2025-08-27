import { IdentificationIcon } from '@heroicons/react/24/solid'
import { Button, classNames } from '@sushiswap/ui'
import { shortenAddress } from 'sushi/format'
import { useSendTokens } from './send-token-provider'

export const RecipientInput = ({
  isRecipientValid,
}: {
  isRecipientValid: boolean
}) => {
  const { mutate, state } = useSendTokens()
  return (
    <div
      className={classNames(
        'overflow-hidden relative p-4 bg-gray-100 rounded-xl dark:bg-slate-900',
      )}
    >
      <div className="flex flex-col gap-4 text-sm md:gap-2 text-muted-foreground">
        Recipient
        <div className="flex flex-col gap-4 justify-between w-full md:gap-0 md:flex-row">
          <input
            type="text"
            placeholder="Enter Address..."
            className="p-0 m-0 w-full font-medium bg-transparent border-none outline-none focus:ring-0 text-[20px] !text-slate-900 dark:!text-slate-100"
            value={
              isRecipientValid
                ? shortenAddress(state.recipientAddress)
                : state.recipientAddress
            }
            onChange={(e) => mutate.setRecipientAddress(e.target.value.trim())}
          />
          <Button
            className="!bg-[#0000001F] dark:!bg-[#FFFFFF1F] !text-slate-900 dark:!text-slate-100"
            onClick={() => mutate.goTo('browseContacts')}
          >
            <IdentificationIcon className="w-5 h-5" />
            View Contact
          </Button>
        </div>
      </div>
    </div>
  )
}
