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
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { getChainById } from 'sushi'
import { type EvmAddress, EvmChainId, EvmToken, USDC } from 'sushi/evm'
import { AnyTokenDeposit } from './any-token-deposit'
import { FiatDeposit } from './fiat-deposit'
import { HyperunitOptions } from './hyperunit-options'
import { USDCOptions } from './usdc-options'

export const HYPEREVM_USDC = new EvmToken({
  chainId: EvmChainId.HYPEREVM,
  address: '0xb88339CB7199b77E23DB6E890353E22632Ba630f' as EvmAddress,
  decimals: 6,
  symbol: 'USDC',
  name: 'USDC',
})

export const USDC_ARB_DEPOSIT_BRIDGE =
  '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7' as EvmAddress
export const USDC_HYPEREVM_DEPOSIT_BRIDGE =
  '0x6B9E773128f453f5c2C60935Ee2DE2CBc5390A24' as EvmAddress

const DEPOSIT_OPTIONS = [
  {
    label: 'Any Token (Arbitrum)',
    value: 'any-arb' as const,
    chainId: EvmChainId.ARBITRUM,
    type: 'any-token' as const,
  },
  {
    label: 'USDC (Arbitrum)',
    value: 'usdc-arb' as const,
    asset: USDC[EvmChainId.ARBITRUM],
    depositBridge: USDC_ARB_DEPOSIT_BRIDGE,
    type: 'token' as const,
  },
  {
    label: 'USDC (HyperEVM)',
    value: 'usdc-hyperevm' as const,
    asset: HYPEREVM_USDC,
    depositBridge: USDC_HYPEREVM_DEPOSIT_BRIDGE,
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
    chainName: 'ethereum' as const,
    token: 'eth',
    tokenType: 'ethereum' as const,
    type: 'hyperunit' as const,
    minDeposit: '0.007',
  },
  {
    label: 'BTC (Bitcoin)',
    value: 'btc' as const,
    chainName: 'bitcoin' as const,
    token: 'btc',
    tokenType: 'bitcoin' as const,
    type: 'hyperunit' as const,
    minDeposit: '0.0003',
  },
  {
    label: 'SOL (Solana)',
    value: 'sol' as const,
    chainName: 'solana' as const,
    token: 'sol',
    tokenType: 'solana' as const,
    type: 'hyperunit' as const,
    minDeposit: '0.12',
  },
  {
    label: 'AVAX (Avalanche)',
    value: 'avax' as const,
    chainName: 'avalanche' as const,
    token: 'avax',
    tokenType: 'avalanche' as const,
    type: 'hyperunit' as const,
    minDeposit: '1.5',
  },
  {
    label: 'BONK (Solana)',
    value: 'bonk' as const,
    chainName: 'solana' as const,
    token: 'bonk',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '1800000',
  },
  {
    label: 'FARTCOIN (Solana)',
    value: 'fartcoin' as const,
    chainName: 'solana' as const,
    token: 'fart',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '55',
  },
  {
    label: 'PUMP (Solana)',
    value: 'pump' as const,
    chainName: 'solana' as const,
    token: 'pump',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '5500',
  },
  {
    label: 'SPX (Solana)',
    value: 'spx' as const,
    chainName: 'solana' as const,
    token: 'spxs',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '32',
  },
  {
    label: '2Z (Solana)',
    value: '2z' as const,
    chainName: 'solana' as const,
    token: '2z',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '150',
  },
  {
    label: 'VIRTUAL (Base)',
    value: 'virtual' as const,
    chainName: 'base' as const,
    token: 'virtual',
    tokenType: 'base' as const,
    type: 'hyperunit' as const,
    minDeposit: '25',
  },
  {
    label: 'MON (Monad)',
    value: 'mon' as const,
    chainName: 'monad' as const,
    token: 'mon',
    tokenType: 'monad' as const,
    type: 'hyperunit' as const,
    minDeposit: '450',
  },
  {
    label: 'XPL (Plasma)',
    value: 'xpl' as const,
    chainName: 'plasma' as const,
    token: 'xpl',
    tokenType: 'plasma' as const,
    type: 'hyperunit' as const,
    minDeposit: '60',
  },
  {
    label: 'ZEC (Zcash)',
    value: 'zec' as const,
    chainName: 'zcash' as const,
    token: 'zec',
    tokenType: 'zcash' as const,
    type: 'hyperunit' as const,
    minDeposit: '0.07',
  },
]

type DepositOption = (typeof DEPOSIT_OPTIONS)[number]

export type AnyTokenDepositOption = Extract<
  DepositOption,
  { type: 'any-token' }
>
export type TokenDepositOption = Extract<DepositOption, { type: 'token' }>
export type HyperunitDepositOption = Extract<
  DepositOption,
  { type: 'hyperunit' }
>

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
        return <FiatDeposit />
      case 'hyperunit':
        return (
          <HyperunitOptions
            depositOption={depositOption}
            setOpen={handleOpenChange}
          />
        )
      case 'any-token':
        return (
          <AnyTokenDeposit
            depositOption={depositOption}
            setOpen={handleOpenChange}
          />
        )
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
      case 'any-token':
        return `Swap to Deposit USDC from ${getChainById(depositOption.chainId).name}`
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
      <PerpsDialogContent
        className={classNames(
          depositOption.type === 'fiat' ? 'max-w-[400px]' : '!max-w-xl',
        )}
      >
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
