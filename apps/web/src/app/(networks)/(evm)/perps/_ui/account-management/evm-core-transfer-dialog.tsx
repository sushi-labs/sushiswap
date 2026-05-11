'use client'

import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import {
  Button,
  IconButton,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
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
import { NativeAddress } from 'src/lib/constants'
import {
  type BalanceItemType,
  type SendableAssetType,
  currencyFormatter,
  perpsNumberFormatter,
  useSendAsset,
  useSendEvmAsset,
  useSendableAssets,
} from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { type EvmAddress, EvmChainId, EvmToken } from 'sushi/evm'
import { useBalances } from '~evm/_common/ui/balance-provider/use-balances'
import { ValueInput } from '../_common'
import { PerpsChecker } from '../perps-checker'

export const EvmCoreTransferDialog = ({
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
  const [open, setOpen] = useState<boolean>(false)
  const [dst, setDst] = useState<'evm' | 'spot'>('evm')
  const [amount, setAmount] = useState<string>('')
  const [assetToSend, setAssetToSend] = useState<SendableAssetType | null>(null)
  const address = useAccount('evm')
  const { sendAsset, isPending: isSendPending } = useSendAsset()
  const { data: sendableAssets } = useSendableAssets('spot')
  const { sendAsset: sendEvmAsset, isPending: isEvmSendPending } =
    useSendEvmAsset()

  const isPending = isSendPending || isEvmSendPending
  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const tokenAddresses = useMemo(() => {
    return (
      sendableAssets
        ?.map((a) => a.evmAddressData?.address)
        .filter(
          (addr): addr is EvmAddress => addr !== undefined && addr !== null,
        ) || []
    )
  }, [sendableAssets])

  const { data: evmBalances } = useBalances(EvmChainId.HYPEREVM, tokenAddresses)

  const sendableEvmAssets = useMemo(() => {
    if (!sendableAssets || !evmBalances) return []
    return sendableAssets
      ?.map((a) => {
        if (!a.evmAddressData) return null
        const balance = evmBalances.get(a.evmAddressData?.address) || 0n
        const price = a.markPrice || '0'
        const currency = new EvmToken({
          chainId: EvmChainId.HYPEREVM,
          address: a.evmAddressData?.address,
          decimals:
            a.evmAddressData?.address === NativeAddress
              ? 18
              : a.decimals + a.evmAddressData.evm_extra_wei_decimals,
          name: a.symbol,
          symbol: a.symbol,
        })
        const amount = new Amount(currency, balance)
        const usdcValue = amount.mulHuman(price).toString()
        return {
          ...a,
          balance: amount.toString(),
          usdcValue,
        }
      })
      .filter((a) => a !== null) satisfies SendableAssetType[]
  }, [sendableAssets, evmBalances])

  const assetsToSelect = useMemo(() => {
    return {
      evm: sendableAssets || [],
      spot: sendableEvmAssets || [],
    }
  }, [sendableAssets, sendableEvmAssets])

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
    if (!assetToSend && assetsToSelect[dst]?.length > 0) {
      if (balanceItem) {
        if (balanceItem.token === null) {
          setAssetToSend(assetsToSelect[dst][0])
          return
        }
        const matchingAsset = assetsToSelect[dst].find(
          (a) => a.tokenId === balanceItem?.token?.tokenId,
        )
        if (matchingAsset) {
          setAssetToSend(matchingAsset)
          return
        }
      }
      setAssetToSend(assetsToSelect[dst][0])
      return
    }
  }, [assetToSend, assetsToSelect, balanceItem, dst])

  const handleMaxAmount = useCallback(() => {
    if (!assetToSend) return
    setAmount(assetToSend.balance)
  }, [assetToSend])

  const sendSpotTokens = useCallback(() => {
    if (!address || !assetToSend || !amount || !assetToSend?.destinationAddress)
      return

    sendAsset(
      {
        destination: assetToSend.destinationAddress,
        sourceDex: 'spot',
        destinationDex: 'spot',
        token: assetToSend.token,
        amount: amount,
        decimals: assetToSend?.decimals,
      },
      {
        onSuccess: () => {
          setAmount('')
          handleOpenChange(false)
        },
      },
    )
  }, [address, assetToSend, amount, sendAsset, handleOpenChange])

  const sendEvmTokens = useCallback(() => {
    if (!address || !assetToSend || !amount || !assetToSend?.evmAddressData) {
      return
    }
    sendEvmAsset(
      {
        assetToSend,
        amount,
      },
      {
        onSuccess: () => {
          setAmount('')
          handleOpenChange(false)
        },
      },
    )
  }, [address, assetToSend, amount, sendEvmAsset, handleOpenChange])

  const send = useCallback(() => {
    if (dst === 'evm') {
      sendSpotTokens()
    } else {
      sendEvmTokens()
    }
  }, [dst, sendSpotTokens, sendEvmTokens])

  const handleDstToggle = useCallback(() => {
    setDst((prevDst) => (prevDst === 'spot' ? 'evm' : 'spot'))
    setAmount('')
    const newDst = dst === 'spot' ? 'evm' : 'spot'
    const index = assetsToSelect[newDst]?.findIndex(
      (a) => a.token === assetToSend?.token,
    )
    if (index !== undefined && index !== -1 && assetsToSelect[newDst][index]) {
      setAssetToSend(assetsToSelect[newDst][index])
    }
  }, [assetsToSelect, assetToSend, dst])

  const amountToSend = useMemo(() => {
    if (!assetToSend || !amount) return undefined
    const decimals =
      dst === 'evm'
        ? assetToSend.decimals
        : assetToSend.evmAddressData?.address === NativeAddress
          ? 18
          : assetToSend.decimals +
            (assetToSend?.evmAddressData?.evm_extra_wei_decimals || 0)
    const currency = new EvmToken({
      chainId: EvmChainId.HYPEREVM,
      address: assetToSend.evmAddressData?.address || '0x',
      decimals: decimals,
      name: assetToSend.symbol,
      symbol: assetToSend.symbol,
    })
    return Amount.tryFromHuman(currency, amount)
  }, [assetToSend, amount, dst])

  const insufficientBalance = useMemo(() => {
    if (!address || !assetToSend || !amountToSend?.currency) return false

    const balance = Amount.tryFromHuman(
      amountToSend?.currency,
      assetToSend.balance,
    )

    if (!balance || !amountToSend) return false

    return balance.lt(amountToSend)
  }, [address, assetToSend, amountToSend])

  return (
    <PerpsDialog
      open={resolvedOpen}
      onOpenChange={(val) => {
        handleOpenChange(val)
      }}
    >
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary" size="sm">
            EVM
            <ArrowsUpDownIcon className="w-3 h-3 rotate-90" /> Core
          </Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent className="max-w-xl">
        <PerpsDialogHeader>
          <PerpsDialogTitle>EVM Transfer</PerpsDialogTitle>
          <PerpsDialogDescription>
            Transfer assets between your HyperEVM and HyperCore Spot balances.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center self-center gap-2">
              <div>{dst === 'spot' ? `EVM` : 'Spot'} </div>
              <IconButton
                variant="perps-secondary"
                onClick={handleDstToggle}
                className="!rounded-full"
                name="switch"
                icon={ArrowsUpDownIcon}
                iconProps={{
                  className: 'w-3 h-3 rotate-90 text-perps-blue',
                }}
              />

              <div>{dst === 'spot' ? 'Spot' : `EVM`}</div>
            </div>

            <Select
              value={assetToSend?.token || ''}
              onValueChange={(value: string) => {
                const asset =
                  assetsToSelect[dst]?.find((a) => a?.token === value) || null
                setAssetToSend(asset)
              }}
            >
              <SelectTrigger className="capitalize whitespace-nowrap text-sm !px-2 !h-[41px] !py-0 !pl-4 !gap-1 !border !border-[#FFFFFF1A] bg-transparent">
                {assetToSend
                  ? `${assetToSend?.symbol} ${Number(assetToSend?.balance) > 0 ? ` - ${perpsNumberFormatter({ value: assetToSend?.balance })}` : ''}`
                  : 'Select Asset'}
              </SelectTrigger>
              <SelectContent className="w-full !bg-black/10">
                {assetsToSelect[dst]?.map((i) => (
                  <SelectItem
                    key={i?.token}
                    value={i?.token}
                    className="capitalize font-medium !text-white gap-4"
                  >
                    {i?.symbol}
                    {' - '}
                    {currencyFormatter.format(Number(i?.usdcValue))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <div className="mt-2">
              <PerpsChecker.Legal size="default" variant="perps-tertiary">
                <Checker.Connect
                  size="default"
                  variant="perps-tertiary"
                  namespace="evm"
                >
                  <Checker.Network
                    chainId={EvmChainId.HYPEREVM}
                    size="default"
                    variant="perps-tertiary"
                  >
                    <Checker.Custom
                      size="default"
                      showChildren={Boolean(assetToSend)}
                      buttonText={'Select Asset'}
                      onClick={() => {}}
                      disabled={!assetToSend}
                      variant="perps-tertiary"
                    >
                      <Checker.Custom
                        size="default"
                        showChildren={Number(amount) > 0}
                        buttonText={'Enter Amount'}
                        onClick={() => {}}
                        disabled={Number(amount) <= 0}
                        variant="perps-tertiary"
                      >
                        <Checker.Custom
                          size="default"
                          showChildren={!insufficientBalance}
                          buttonText={'Insufficient Balance'}
                          onClick={() => {}}
                          disabled={Boolean(insufficientBalance)}
                          variant="perps-tertiary"
                        >
                          <Checker.ApproveERC20
                            contract={assetToSend?.spender}
                            enabled={
                              dst === 'spot' && assetToSend?.symbol === 'USDC'
                            }
                            amount={amountToSend}
                            id="evm-core-transfer-approve"
                            variant="perps-tertiary"
                            size="default"
                          >
                            <Button
                              size="default"
                              className="w-full"
                              onClick={send}
                              loading={isPending}
                              variant="perps-tertiary"
                            >
                              Confirm
                            </Button>
                          </Checker.ApproveERC20>
                        </Checker.Custom>
                      </Checker.Custom>
                    </Checker.Custom>
                  </Checker.Network>
                </Checker.Connect>
              </PerpsChecker.Legal>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
