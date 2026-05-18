'use client'
import {
  Button,
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
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { getChainById } from 'sushi'
import { type EvmAddress, EvmChainId, EvmToken, USDC } from 'sushi/evm'
import { USDCOptions } from './usdc-options'

const HYPEREVM_USDC = new EvmToken({
  chainId: EvmChainId.HYPEREVM,
  address: '0xb88339CB7199b77E23DB6E890353E22632Ba630f' as EvmAddress,
  decimals: 6,
  symbol: 'USDC',
  name: 'USDC',
})

const DEPOSIT_OPTIONS = [
  {
    label: 'USDC (Arbitrum)',
    value: 'usdc-arb' as const,
    asset: USDC[EvmChainId.ARBITRUM],
    depositBridge: '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7' as EvmAddress,
    type: 'token' as const,
  },
  {
    label: 'USDC (HyperEVM)',
    value: 'usdc-hyperevm' as const,
    asset: HYPEREVM_USDC,
    depositBridge: '0x6B9E773128f453f5c2C60935Ee2DE2CBc5390A24' as EvmAddress,
    type: 'token' as const,
  },
  {
    label: 'Fiat',
    value: 'fiat' as const,
    type: 'fiat' as const,
  },
  {
    label: 'ETH (Ethereum Mainnet)',
    value: 'eth' as const,
    type: 'hyperunit' as const,
  },
]

type DepositOption = (typeof DEPOSIT_OPTIONS)[number]

export type TokenDepositOption = Extract<DepositOption, { type: 'token' }>

export const DepositDialog = ({
  trigger,
  isOpen,
  onOpenChange,
}: {
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [depositOption, setDepositOption] = useState<DepositOption>(
    DEPOSIT_OPTIONS[0],
  )
  const [open, setOpen] = useState<boolean>(false)

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

  const content = useMemo(() => {
    switch (depositOption.type) {
      case 'token':
        return (
          <USDCOptions
            depositOption={depositOption}
            setOpen={handleOpenChange}
          />
        )
      case 'fiat':
        return <div>Todo: Fiat on ramp options</div>
      case 'hyperunit':
        return <div>Todo: Hyperunit options</div>
      default:
        return null
    }
  }, [depositOption, handleOpenChange])

  const description = useMemo(() => {
    switch (depositOption.type) {
      case 'token':
        return `Deposit ${depositOption.asset.symbol} from ${getChainById(depositOption.asset.chainId).name}`
      case 'fiat':
        return 'Deposit Fiat'
      case 'hyperunit':
        return `Deposit ${depositOption.label} via Unit`
      default:
        return null
    }
  }, [depositOption])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" variant="perps-default" className="w-full">
            Deposit
          </Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Deposit</PerpsDialogTitle>
          <PerpsDialogDescription>{description}</PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent className="!pt-0">
          <Select
            value={depositOption.value}
            onValueChange={(val: string) => {
              const option = DEPOSIT_OPTIONS.find((o) => o.value === val)
              if (option) setDepositOption(option)
            }}
          >
            <SelectTrigger className="w-full text-sm !px-2 !h-[40px] !gap-1 !border-[#FFFFFF1A] bg-transparent !border">
              {depositOption.label}
            </SelectTrigger>
            <SelectContent className="w-full !bg-black/10">
              {DEPOSIT_OPTIONS?.map((i, idx) => (
                <SelectItem
                  key={`${i.value}-${idx}`}
                  value={i.value}
                  className="font-medium !text-white gap-4"
                >
                  {i.label}{' '}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-4">{content}</div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
