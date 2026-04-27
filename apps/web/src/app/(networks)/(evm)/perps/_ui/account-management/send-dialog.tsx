'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  classNames,
} from '@sushiswap/ui'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type BalanceItemType,
  type SendableAssetType,
  currencyFormatter,
  perpsNumberFormatter,
  useSendAsset,
  useSendableAssets,
} from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, EvmToken, isEvmAddress } from 'sushi/evm'
import { useWalletClient } from 'wagmi'
import { ValueInput } from '../_common'
import { PerpsChecker } from '../perps-checker'
import { useUserSettingsState } from './settings-provider'

export const SendDialog = ({
  trigger,
  isOpen,
  onOpenChange,
  balanceItem,
}: {
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  balanceItem?: BalanceItemType
}) => {
  const [dstAddress, setDstAddress] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const [assetToSend, setAssetToSend] = useState<SendableAssetType | null>(null)
  const { data: walletClient } = useWalletClient()
  const address = useAccount('evm')
  const { sendAsset, isPending } = useSendAsset()
  const { data: sendableAssets } = useSendableAssets()
  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )

  useEffect(() => {
    if (!assetToSend && sendableAssets.length > 0) {
      if (balanceItem) {
        if (balanceItem.token === null) {
          //usdc perps
          setAssetToSend(sendableAssets[0])
          return
        }
        const matchingAsset = sendableAssets.find(
          (a) => a.tokenId === balanceItem?.token?.tokenId,
        )
        if (matchingAsset) {
          setAssetToSend(matchingAsset)
          return
        }
      }
      setAssetToSend(sendableAssets[0])
      return
    }
  }, [assetToSend, sendableAssets, balanceItem])

  const handleMaxAmount = useCallback(() => {
    if (!assetToSend) return
    setAmount(assetToSend.balance)
  }, [assetToSend])

  const sendTokens = useCallback(() => {
    if (!walletClient || !address || !assetToSend || !amount) return
    sendAsset(
      {
        destination: dstAddress,
        sourceDex: assetToSend?.marketType === 'perp' ? '' : 'spot',
        destinationDex: assetToSend?.marketType === 'perp' ? '' : 'spot',
        token: assetToSend.token,
        amount: amount,
        decimals: assetToSend?.decimals,
      },
      {
        onSuccess: () => {
          setAmount('')
          setDstAddress('')
          handleOpenChange(false)
        },
      },
    )
  }, [
    walletClient,
    address,
    assetToSend,
    amount,
    dstAddress,
    sendAsset,
    handleOpenChange,
  ])

  const insufficientBalance = useMemo(() => {
    if (!address || !assetToSend) return false
    const currency = new EvmToken({
      chainId: EvmChainId.ARBITRUM,
      address: '0x',
      decimals: assetToSend.decimals,
      name: assetToSend.token,
      symbol: assetToSend.token,
    })
    const balance = Amount.tryFromHuman(currency, assetToSend.balance)
    const amountToSend = Amount.tryFromHuman(currency, amount)

    if (!balance || !amountToSend) return false

    return balance.lt(amountToSend)
  }, [address, assetToSend, amount])

  return (
    <Dialog
      open={resolvedOpen}
      onOpenChange={(val) => {
        handleOpenChange(val)
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary">
            Send
          </Button>
        )}
      </DialogTrigger>
      <DialogContent variant="perps-default" className="max-w-xl">
        <DialogHeader className="!text-left">
          <DialogTitle>Send Tokens</DialogTitle>
          <DialogDescription>
            Send tokens to another account on the Hyperliquid L1.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <ValueInput
              value={dstAddress}
              onChange={setDstAddress}
              label=""
              placeholder="Destination Address"
              type="text"
              inputClassName="!text-left !text-sm placeholder:text-[#8f9399]"
              className="!px-2 !py-0.5 !text-sm"
            />
            <div className="flex items-center gap-2 ">
              <div className="relative flex w-full">
                <ValueInput
                  value={amount}
                  onChange={setAmount}
                  label=""
                  type="number"
                  placeholder="Amount"
                  inputClassName="!text-left !text-sm placeholder:text-[#8f9399] pr-10"
                  maxDecimals={assetToSend?.decimals ?? 2}
                  className="!px-2 !py-0.5 !text-sm"
                />
                <Button
                  size="xs"
                  variant={'perps-secondary'}
                  onClick={handleMaxAmount}
                  className={classNames(
                    'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md absolute top-1/2 -translate-y-1/2 right-2',
                  )}
                >
                  Max
                </Button>
              </div>
              <Select
                value={assetToSend?.token || ''}
                onValueChange={(value: string) => {
                  const asset =
                    sendableAssets?.find((a) => a.token === value) || null
                  setAssetToSend(asset)
                }}
              >
                <SelectTrigger className="capitalize whitespace-nowrap text-sm !px-2 !h-[41px] !py-0 !pl-4 !gap-1 !border !border-[#FFFFFF1A] bg-transparent">
                  {assetToSend
                    ? `${assetToSend?.symbol}  ${isUnifiedAccountModeEnabled ? '' : assetToSend?.marketType === 'perp' ? '(Perps)' : '(Spot)'} ${Number(assetToSend?.balance) > 0 ? ` - ${perpsNumberFormatter({ value: assetToSend?.balance })}` : ''}`
                    : 'Select Asset'}
                </SelectTrigger>
                <SelectContent className="w-full">
                  {sendableAssets?.map((i) => (
                    <SelectItem
                      key={i.token}
                      value={i.token}
                      className="capitalize font-medium !text-white gap-4"
                    >
                      {i.symbol}{' '}
                      {isUnifiedAccountModeEnabled
                        ? ''
                        : i.marketType === 'perp'
                          ? '(Perps)'
                          : '(Spot)'}
                      {' - '}
                      {currencyFormatter.format(Number(i.usdcValue))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2">
              <PerpsChecker.Legal size="default" variant="perps-default">
                <Checker.Connect
                  variant="perps-default"
                  size="default"
                  namespace="evm"
                >
                  <Checker.Custom
                    size="default"
                    showChildren={Boolean(assetToSend)}
                    buttonText={'Select Asset'}
                    onClick={() => {}}
                    disabled={!assetToSend}
                    variant="perps-default"
                  >
                    <Checker.Custom
                      size="default"
                      showChildren={isEvmAddress(dstAddress)}
                      buttonText={'Enter Address'}
                      onClick={() => {}}
                      disabled={!isEvmAddress(dstAddress)}
                      variant="perps-default"
                    >
                      <Checker.Custom
                        size="default"
                        showChildren={Number(amount) > 0}
                        buttonText={'Enter Amount'}
                        onClick={() => {}}
                        disabled={Number(amount) <= 0}
                        variant="perps-default"
                      >
                        <Checker.Custom
                          size="default"
                          showChildren={!insufficientBalance}
                          buttonText={'Insufficient Balance'}
                          onClick={() => {}}
                          disabled={Boolean(insufficientBalance)}
                          variant="perps-default"
                        >
                          <Button
                            size="default"
                            className="w-full"
                            onClick={sendTokens}
                            loading={isPending}
                            variant="perps-default"
                          >
                            Send
                          </Button>
                        </Checker.Custom>
                      </Checker.Custom>
                    </Checker.Custom>
                  </Checker.Custom>
                </Checker.Connect>
              </PerpsChecker.Legal>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
