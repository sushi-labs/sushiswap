import { ChevronDownIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { FundSource } from '@sushiswap/hooks'
import { classNames, NetworkIcon } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import { CurrencyInputProps } from '@sushiswap/wagmi/components/Web3Input/Currency'
import { FC, useCallback, useMemo, useState } from 'react'

import { NetworkSelectorOverlay } from './NetworkSelectorOverlay'

interface CurrencyInputWithNetworkSelectorProps extends CurrencyInputProps {
  onNetworkSelect(chainId: ChainId): void
  className?: string
}

export const CurrencyInputWithNetworkSelector: FC<CurrencyInputWithNetworkSelectorProps> = ({
  onNetworkSelect,
  disabled,
  value,
  onChange,
  currency,
  onSelect,
  chainId,
  tokenMap,
  disableMaxButton = false,
  usdPctChange,
  className,
  fundSource = FundSource.WALLET,
  loading,
}) => {
  const [networkSelectorOpen, setNetworkSelectorOpen] = useState(false)

  const handleClose = useCallback(() => {
    setNetworkSelectorOpen(false)
  }, [])

  return useMemo(
    () => (
      <div className={classNames('flex flex-col p-3', className)}>
        <div className="flex flex-row justify-between">
          <button
            type="button"
            className="relative flex items-center gap-1 py-1 text-xs font-medium text-slate-400 hover:text-slate-300"
            onClick={(e) => {
              setNetworkSelectorOpen(true)
              e.stopPropagation()
            }}
          >
            <NetworkIcon chainId={chainId} width="16px" height="16px" className="mr-1" />
            {chains[chainId].name} <ChevronDownIcon width={16} height={16} />
          </button>
        </div>
        <Web3Input.Currency
          disabled={disabled}
          currency={currency}
          onSelect={onSelect}
          chainId={chainId}
          fundSource={fundSource}
          disableMaxButton={disableMaxButton}
          tokenMap={tokenMap}
          onChange={onChange}
          value={value}
          usdPctChange={usdPctChange}
          loading={loading}
        />
        <NetworkSelectorOverlay
          open={networkSelectorOpen}
          onClose={handleClose}
          onSelect={onNetworkSelect}
          selected={chainId}
        />
      </div>
    ),
    [
      chainId,
      className,
      currency,
      disableMaxButton,
      disabled,
      fundSource,
      handleClose,
      loading,
      networkSelectorOpen,
      onChange,
      onNetworkSelect,
      onSelect,
      tokenMap,
      usdPctChange,
      value,
    ]
  )
}
