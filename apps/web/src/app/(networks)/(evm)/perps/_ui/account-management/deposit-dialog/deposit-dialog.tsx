'use client'
import {
  Button,
  Currency,
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
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { getChainById } from 'sushi'
import { type EvmAddress, EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { SvmChainId, SvmNative, SvmToken, svmAddress } from 'sushi/svm'
import { AnyTokenDeposit } from './any-token-deposit'
// import { FiatDeposit } from './fiat-deposit'
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
    label: 'USDC (HyperEVM)',
    value: 'usdc-hyperevm' as const,
    asset: HYPEREVM_USDC,
    depositBridge: USDC_HYPEREVM_DEPOSIT_BRIDGE,
    type: 'token' as const,
    chainId: EvmChainId.HYPEREVM,
  },
  {
    label: 'Any Token (Arbitrum)',
    value: 'any-arb' as const,
    chainId: EvmChainId.ARBITRUM,
    type: 'any-token' as const,
  },
  // {
  //   label: 'Fiat',
  //   value: 'fiat' as const,
  //   type: 'fiat' as const,
  // },
  {
    label: 'ETH (Ethereum Mainnet)',
    value: 'eth' as const,
    chainName: 'ethereum' as const,
    token: 'eth',
    tokenType: 'ethereum' as const,
    type: 'hyperunit' as const,
    minDeposit: '0.007',
    chainId: EvmChainId.ETHEREUM,
    asset: EvmNative.fromChainId(EvmChainId.ETHEREUM),
  },
  {
    label: 'BTC (Bitcoin)',
    value: 'btc' as const,
    chainName: 'bitcoin' as const,
    token: 'btc',
    tokenType: 'bitcoin' as const,
    type: 'hyperunit' as const,
    minDeposit: '0.0003',
    chainId: 'Bitcoin' as const,
  },
  {
    label: 'SOL',
    value: 'sol' as const,
    chainName: 'solana' as const,
    token: 'sol',
    tokenType: 'solana' as const,
    type: 'hyperunit' as const,
    minDeposit: '0.12',
    chainId: SvmChainId.SOLANA,
    asset: SvmNative.fromChainId(SvmChainId.SOLANA),
  },
  {
    label: 'AVAX (Avalanche)',
    value: 'avax' as const,
    chainName: 'avalanche' as const,
    token: 'avax',
    tokenType: 'avalanche' as const,
    type: 'hyperunit' as const,
    minDeposit: '1.5',
    chainId: EvmChainId.AVALANCHE,
    asset: EvmNative.fromChainId(EvmChainId.AVALANCHE),
  },
  {
    label: 'BONK',
    value: 'bonk' as const,
    chainName: 'solana' as const,
    token: 'bonk',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '1800000',
    chainId: SvmChainId.SOLANA,
    asset: new SvmToken({
      chainId: SvmChainId.SOLANA,
      address: svmAddress('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
      decimals: 5,
      symbol: 'BONK',
      name: 'Bonk',
    }),
  },
  {
    label: 'FARTCOIN',
    value: 'fartcoin' as const,
    chainName: 'solana' as const,
    token: 'fart',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '55',
    chainId: SvmChainId.SOLANA,
    asset: new SvmToken({
      chainId: SvmChainId.SOLANA,
      address: svmAddress('9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump'),
      decimals: 6,
      symbol: 'FARTCOIN',
      name: 'Fartcoin',
    }),
  },
  {
    label: 'PUMP',
    value: 'pump' as const,
    chainName: 'solana' as const,
    token: 'pump',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '5500',
    chainId: SvmChainId.SOLANA,
    asset: new SvmToken({
      chainId: SvmChainId.SOLANA,
      address: svmAddress('pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn'),
      decimals: 6,
      symbol: 'PUMP',
      name: 'Pump',
    }),
  },
  {
    label: 'SPX',
    value: 'spx' as const,
    chainName: 'solana' as const,
    token: 'spxs',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '32',
    chainId: SvmChainId.SOLANA,
    asset: new SvmToken({
      chainId: SvmChainId.SOLANA,
      address: svmAddress('J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr'),
      decimals: 8,
      symbol: 'SPX',
      name: 'SPX6900',
    }),
  },
  {
    label: '2Z',
    value: '2z' as const,
    chainName: 'solana' as const,
    token: '2z',
    tokenType: 'spl' as const,
    type: 'hyperunit' as const,
    minDeposit: '150',
    chainId: SvmChainId.SOLANA,
    asset: new SvmToken({
      chainId: SvmChainId.SOLANA,
      address: svmAddress('J6pQQ3FAcJQeWPPGppWRb4nM8jU3wLyYbRrLh7feMfvd'),
      decimals: 8,
      symbol: '2Z',
      name: 'DoubleZero',
    }),
  },
  {
    label: 'VIRTUAL',
    value: 'virtual' as const,
    chainName: 'base' as const,
    token: 'virtual',
    tokenType: 'base' as const,
    type: 'hyperunit' as const,
    minDeposit: '25',
    chainId: EvmChainId.BASE,
    asset: new EvmToken({
      chainId: EvmChainId.BASE,
      address: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
      decimals: 18,
      symbol: 'VIRTUAL',
      name: 'Virtual Protocol',
    }),
  },
  {
    label: 'MON (Monad)',
    value: 'mon' as const,
    chainName: 'monad' as const,
    token: 'mon',
    tokenType: 'monad' as const,
    type: 'hyperunit' as const,
    minDeposit: '450',
    chainId: EvmChainId.MONAD,
    asset: EvmNative.fromChainId(EvmChainId.MONAD),
  },
  {
    label: 'XPL (Plasma)',
    value: 'xpl' as const,
    chainName: 'plasma' as const,
    token: 'xpl',
    tokenType: 'plasma' as const,
    type: 'hyperunit' as const,
    minDeposit: '60',
    chainId: EvmChainId.PLASMA,
    asset: EvmNative.fromChainId(EvmChainId.PLASMA),
  },
  {
    label: 'ZEC (Zcash)',
    value: 'zec' as const,
    chainName: 'zcash' as const,
    token: 'zec',
    tokenType: 'zcash' as const,
    type: 'hyperunit' as const,
    minDeposit: '0.07',
    chainId: 'Zcash' as const,
  },
]

const DEPOSIT_CHAIN_OPTIONS = Array.from(
  new Set(DEPOSIT_OPTIONS.map((option) => option.chainId)),
)

type DepositChainOption = (typeof DEPOSIT_CHAIN_OPTIONS)[number]

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
  const { isOpen: isSidebarOpen } = useSidebar()
  const [selectedChain, setSelectedChain] = useState<DepositChainOption>(
    DEPOSIT_CHAIN_OPTIONS[0],
  )
  const [depositOption, setDepositOption] = useState<DepositOption>(
    DEPOSIT_OPTIONS[0],
  )
  const [open, setOpen] = useState<boolean>(false)

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isSidebarOpen) return
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange, isSidebarOpen],
  )

  const content = useMemo(() => {
    switch (depositOption.type) {
      case 'token':
        return (
          <USDCOptions
            depositChainId={depositOption.chainId}
            setOpen={handleOpenChange}
          />
        )
      // case 'fiat':
      //   return <FiatDeposit />
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
      // case 'fiat':
      //   return 'Deposit Fiat'
      case 'hyperunit':
        return `Deposit ${depositOption.label} via Unit`
      case 'any-token':
        return `Swap to Deposit USDC from ${getChainById(depositOption.chainId).name}`
      default:
        return null
    }
  }, [depositOption])

  const optionsBySelectedChain = useMemo(() => {
    return DEPOSIT_OPTIONS.filter((option) => option.chainId === selectedChain)
  }, [selectedChain])

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
          // depositOption.type === 'fiat' ? 'max-w-[400px]' :
          '!max-w-xl',
        )}
      >
        <PerpsDialogHeader>
          <PerpsDialogTitle>Deposit</PerpsDialogTitle>
          <PerpsDialogDescription>{description}</PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent className="!pt-0">
          <Select
            value={selectedChain.toString()}
            onValueChange={(val: string | number) => {
              const chain = DEPOSIT_CHAIN_OPTIONS.find(
                (c) => c.toString() === val,
              )
              if (chain) {
                setSelectedChain(chain)
                const option = DEPOSIT_OPTIONS.find((o) => o.chainId === chain)
                if (option) setDepositOption(option)
              }
            }}
          >
            <SelectTrigger className="w-full text-sm !px-2 !h-[40px] !gap-1 !border-[#FFFFFF1A] bg-transparent !border">
              <div className="flex items-center gap-1">
                <_NetworkIcon chainId={selectedChain} />
                {typeof selectedChain === 'number'
                  ? getChainById(selectedChain)?.name
                  : selectedChain}
              </div>
            </SelectTrigger>
            <SelectContent className="w-full !bg-black/10">
              {DEPOSIT_CHAIN_OPTIONS?.map((i, idx) => (
                <SelectItem
                  key={`${i}-${idx}`}
                  value={i.toString()}
                  className="font-medium !text-white gap-4"
                >
                  <div className="flex items-center gap-1">
                    <_NetworkIcon chainId={i} />
                    {typeof i === 'number' ? getChainById(i)?.name : i}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {optionsBySelectedChain.length > 1 ? (
            <Select
              value={depositOption.value}
              onValueChange={(val: string) => {
                const option = optionsBySelectedChain.find(
                  (o) => o.value === val,
                )
                if (option) setDepositOption(option)
              }}
            >
              <SelectTrigger className="w-full text-sm !px-2 mt-2 !h-[40px] !gap-1 !border-[#FFFFFF1A] bg-transparent !border">
                <div className="flex items-center gap-1">
                  {depositOption.asset ? (
                    <Currency.Icon
                      disableLink
                      currency={depositOption.asset}
                      width={20}
                      height={20}
                    />
                  ) : null}
                  {depositOption.label}
                </div>
              </SelectTrigger>
              <SelectContent className="w-full !bg-black/10">
                {optionsBySelectedChain?.map((i, idx) => (
                  <SelectItem
                    key={`${i.value}-${idx}`}
                    value={i.value}
                    className="font-medium !text-white gap-4"
                  >
                    <div className="flex items-center gap-1">
                      {i.asset ? (
                        <Currency.Icon
                          disableLink
                          currency={i.asset}
                          width={20}
                          height={20}
                        />
                      ) : null}
                      {i.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <div className="mt-2">{content}</div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}

const _NetworkIcon = ({ chainId }: { chainId: DepositChainOption }) => {
  const value = useMemo(() => {
    if (typeof chainId === 'number') {
      return null
    }
    switch (chainId) {
      case 'Bitcoin':
        return 'BTC'
      case 'Zcash':
        return 'ZEC'
      default:
        return null
    }
  }, [chainId])

  if (typeof chainId === 'number') {
    return <NetworkIcon chainId={chainId} width={20} height={20} />
  }
  return (
    <img
      src={`https://app.hyperliquid.xyz/coins/${value}.svg`}
      alt={chainId}
      className={classNames('rounded-full w-5 h-5')}
    />
  )
}
