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
import { type BalanceItemType, currencyFormatter } from 'src/lib/perps'
import { useSendAsset } from 'src/lib/perps/exchange/use-send-asset'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, EvmToken, isEvmAddress } from 'sushi/evm'
import { useWalletClient } from 'wagmi'
import { useUserState } from '~evm/perps/user-provider'
import { ValueInput } from '../_common'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'
import { useUserSettingsState } from './settings-provider'

type SendableAsset = {
  token: string
  balance: string
  decimals: number
  marketType: 'perp' | 'spot'
  usdcValue: string
  symbol: string
  tokenId: string | null
}

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
  const [assetToSend, setAssetToSend] = useState<SendableAsset | null>(null)
  const { data: walletClient } = useWalletClient()
  const address = useAccount('evm')
  const { sendAsset, isPending } = useSendAsset()
  const {
    state: {
      webData2Query: { data },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()
  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

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

  const sendableAssets = useMemo(() => {
    const assets: SendableAsset[] = []
    const usdcPerp = {
      token: 'USDC',
      balance: data?.clearinghouseState.withdrawable || '0',
      decimals: 2,
      marketType: 'perp' as const,
      usdcValue: data?.clearinghouseState.withdrawable || '0',
      symbol: 'USDC',
      tokenId: null,
    }
    if (!isUnifiedAccountModeEnabled) {
      assets.push(usdcPerp)
    }
    for (const spotBalance of data?.spotState?.balances || []) {
      if (spotBalance.total === '0.0') continue
      const tokenIndex = spotBalance.token
      const spotAsset = assetList
        ?.entries()
        .find(([, v]) => v.tokens?.find((t) => t.index === tokenIndex))?.[1]

      if (!spotAsset) continue
      const spotToken = spotAsset?.tokens?.[tokenIndex === 0 ? 1 : 0]
      if (!spotToken) continue
      const price =
        spotBalance.coin === 'USDC' ? 1 : (Number(spotAsset?.markPrice) ?? 0)
      const usdcValue = Number(spotBalance.total || 0) * price
      assets.push({
        token: `${spotToken?.name}:${spotToken?.tokenId}`,
        symbol: spotToken?.name || '',
        balance: spotBalance.total,
        decimals: spotToken?.weiDecimals,
        marketType: 'spot' as const,
        usdcValue: usdcValue.toString(),
        tokenId: spotToken?.tokenId,
      })
    }
    return assets
  }, [data, assetList, isUnifiedAccountModeEnabled])

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
        if (!val) {
          setAmount('')
          setDstAddress('')
          setAssetToSend(sendableAssets.length > 0 ? sendableAssets[0] : null)
        }
      }}
    >
      <DialogTrigger
        asChild
        // disabled={isUnifiedAccountModeEnabled}
      >
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary">
            Send
          </Button>
        )}
      </DialogTrigger>
      <DialogContent variant="perps-default">
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
              inputClassName="!text-left !text-sm placeholder:text-[#4A5565]"
              className="!px-2 !py-0 !text-sm"
            />
            <div className="flex items-center gap-2">
              <div className="relative flex w-full">
                <ValueInput
                  value={amount}
                  onChange={setAmount}
                  label=""
                  type="number"
                  placeholder="Amount"
                  inputClassName="!text-left !text-sm placeholder:text-[#4A5565] pr-10"
                  maxDecimals={assetToSend?.decimals ?? 2}
                  className="!px-2 !py-0 !text-sm"
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
                <SelectTrigger className="capitalize whitespace-nowrap text-sm !px-2 !h-[42px]  !gap-1 !border !border-[#FFFFFF1A] bg-[#FFFFFF0D]">
                  {assetToSend
                    ? `${assetToSend.symbol} (${assetToSend.marketType === 'perp' ? 'Perps' : 'Spot'})`
                    : 'Select Asset'}
                </SelectTrigger>
                <SelectContent className="w-full">
                  {sendableAssets.map((i) => (
                    <SelectItem
                      key={i.token}
                      value={i.token}
                      className="capitalize font-medium !text-white gap-4"
                    >
                      {i.symbol} ({i.marketType === 'perp' ? 'Perps' : 'Spot'})
                      {' - '}
                      {currencyFormatter.format(Number(i.usdcValue))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2">
              <PerpsChecker.Legal size="xl" variant="perps-default">
                <Checker.Connect variant="perps-default">
                  <Checker.Custom
                    showChildren={Boolean(assetToSend)}
                    buttonText={'Select Asset'}
                    onClick={() => {}}
                    disabled={!assetToSend}
                    variant="perps-default"
                  >
                    <Checker.Custom
                      showChildren={isEvmAddress(dstAddress)}
                      buttonText={'Enter Address'}
                      onClick={() => {}}
                      disabled={!isEvmAddress(dstAddress)}
                      variant="perps-default"
                    >
                      <Checker.Custom
                        showChildren={Number(amount) > 0}
                        buttonText={'Enter Amount'}
                        onClick={() => {}}
                        disabled={Number(amount) <= 0}
                        variant="perps-default"
                      >
                        <Checker.Custom
                          showChildren={!insufficientBalance}
                          buttonText={'Insufficient Balance'}
                          onClick={() => {}}
                          disabled={Boolean(insufficientBalance)}
                          variant="perps-default"
                        >
                          <Button
                            size="xl"
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
