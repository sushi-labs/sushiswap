import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import {
  Button,
  type ButtonProps,
  Command,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sushiswap/ui'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import { useState } from 'react'
import { MAX_UINT256 } from '~tron/_common/constants/max-uint256'
import { useTronWeb } from '~tron/_common/lib/hooks/useTronWeb'
import { parseUnits, toBigNumber } from '~tron/_common/lib/utils/formatters'
import {
  getTransactionInfo,
  parseTxnError,
} from '~tron/_common/lib/utils/helpers'
import { getTronscanTxnLink } from '~tron/_common/lib/utils/tronscan-helpers'
import type { IToken } from '~tron/_common/types/token-type'

export const ApproveToken = ({
  tokenToApprove,
  amount,
  spenderAddress,
  onSuccess,
  buttonProps,
}: {
  tokenToApprove: IToken
  amount: string
  spenderAddress: string
  onSuccess: () => Promise<void>
  buttonProps?: ButtonProps
}) => {
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const { address, signTransaction } = useWallet()
  const { tronWeb } = useTronWeb()

  const approveToken = async (type: 'one-time' | 'unlimited') => {
    try {
      setIsApproving(true)
      const parsedAmount = parseUnits(amount, tokenToApprove.decimals)
      const approvalAmount = type === 'one-time' ? parsedAmount : MAX_UINT256
      const { transaction } =
        await tronWeb.transactionBuilder.triggerSmartContract(
          tokenToApprove.address, //contract address
          'approve(address,uint256)', //function name
          {}, // options
          [
            { type: 'address', value: spenderAddress },
            { type: 'uint256', value: approvalAmount },
          ], //parameters
          address, //issuerAddress
        )
      const signedTransation = await signTransaction(transaction)
      const _result = await tronWeb.trx.sendRawTransaction(signedTransation)
      if (!_result.result && 'code' in _result) {
        throw new Error(parseTxnError(_result.code))
      }
      const txId = _result?.txid
      createInfoToast({
        summary:
          type === 'one-time'
            ? 'Approving One Time...'
            : 'Approval Unlimited Amount...',
        type: 'approval',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txId,
        href: getTronscanTxnLink(txId),
      })
      const transactionInfo = await getTransactionInfo(tronWeb, txId)
      if (transactionInfo?.receipt?.result !== 'SUCCESS') {
        throw new Error('Approval failed')
      }
      //create success toast
      createSuccessToast({
        summary: 'Approval successful',
        txHash: txId,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        href: getTronscanTxnLink(txId),
      })
      await onSuccess()
      setIsApproving(false)
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : ((error as Error)?.message ??
            'An error occurred while setting approval')
      //create error toast
      createFailedToast({
        summary: errorMessage,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })
      console.log(error)
      setIsApproving(false)
    }
  }

  return (
    <Button
      asChild
      disabled={isApproving}
      loading={isApproving}
      role="combobox"
      className="w-full relative"
      onClick={async (e) => {
        e.stopPropagation()
        await approveToken('one-time')
      }}
      onKeyDown={async (e) => {
        e.stopPropagation()
        await approveToken('one-time')
      }}
      size="xl"
      {...buttonProps}
    >
      <span>{isApproving ? 'Approving' : 'Approve'}</span>
      <Popover>
        <PopoverTrigger
          asChild
          className="w-fit absolute top-0 bottom-1 right-0"
          disabled={isApproving}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Button
            asChild
            size="xs"
            variant="ghost"
            name="Select"
            className="h-full"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll">
          <Command>
            <CommandGroup>
              <CommandItem className="cursor-pointer">
                <div
                  onClick={async () => {
                    await approveToken('one-time')
                  }}
                  onKeyDown={async () => {
                    await approveToken('one-time')
                  }}
                  className="flex flex-col"
                >
                  <p className="font-bold">Approve one-time only</p>
                  <p>
                    You&apos;ll give your approval to spend{' '}
                    {toBigNumber(amount).toString(10)} {tokenToApprove.symbol}{' '}
                    on your behalf
                  </p>
                </div>
              </CommandItem>
              <CommandItem className="cursor-pointer">
                <div
                  onClick={async () => {
                    await approveToken('unlimited')
                  }}
                  onKeyDown={async () => {
                    await approveToken('unlimited')
                  }}
                  className="flex flex-col"
                >
                  <p className="font-bold">Approve unlimited amount</p>
                  <p>
                    You won&apos;t need to approve again next time you want to
                    spend {tokenToApprove.symbol}.
                  </p>
                </div>
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </Button>
  )
}
