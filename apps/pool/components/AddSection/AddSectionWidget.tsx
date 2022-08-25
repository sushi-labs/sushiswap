import { PlusIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { Widget } from '@sushiswap/ui/widget'
import { Web3Input } from '@sushiswap/wagmi'
import { FC, ReactNode } from 'react'

import { useCustomTokens } from '../../lib/state/storage'
import { useTokens } from '../../lib/state/token-lists'

interface AddSectionWidgetProps {
  chainId: ChainId
  input0: string
  input1: string
  token0: Type | undefined
  token1: Type | undefined
  onSelectToken0?(currency: Type): void
  onSelectToken1?(currency: Type): void
  onInput0(value: string): void
  onInput1(value: string): void
  children: ReactNode
}

export const AddSectionWidget: FC<AddSectionWidgetProps> = ({
  chainId,
  input0,
  input1,
  token0,
  token1,
  onSelectToken0,
  onSelectToken1,
  onInput0,
  onInput1,
  children,
}) => {
  const tokenMap = useTokens(chainId)
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)

  return (
    <Widget id="addLiquidity" maxWidth={400}>
      <Widget.Content>
        <Widget.Header title="Add Liquidity" />
        <Web3Input.Currency
          className="p-3"
          loading={false}
          value={input0}
          onChange={onInput0}
          onSelect={onSelectToken0}
          currency={token0}
          customTokenMap={customTokensMap}
          onAddToken={addCustomToken}
          onRemoveToken={removeCustomToken}
          chainId={chainId}
          tokenMap={tokenMap}
        />
        <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
          <div className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full">
            <PlusIcon width={16} height={16} />
          </div>
        </div>
        <div className="bg-slate-800">
          <Web3Input.Currency
            className="p-3 !pb-1"
            value={input1}
            onChange={onInput1}
            currency={token1}
            onSelect={onSelectToken1}
            customTokenMap={customTokensMap}
            onAddToken={addCustomToken}
            onRemoveToken={removeCustomToken}
            chainId={chainId}
            tokenMap={tokenMap}
          />
          <div className="p-3">{children}</div>
        </div>
      </Widget.Content>
    </Widget>
  )
}
