import { ChevronDownIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames, Currency, Widget } from '@sushiswap/ui'
import { TokenSelector, TokenSelectorProps } from '@sushiswap/wagmi'
import React, { FC, useCallback, useState } from 'react'

interface SelectPoolTokensWidget
  extends Pick<TokenSelectorProps, 'customTokenMap' | 'tokenMap' | 'chainId' | 'onAddToken' | 'onRemoveToken'> {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  onSelectToken0(token: Type): void
  onSelectToken1(token: Type): void
}

export const SelectPoolTokensWidget: FC<SelectPoolTokensWidget> = ({
  tokenMap,
  customTokenMap,
  onRemoveToken,
  onSelectToken0,
  onSelectToken1,
  onAddToken,
  token0,
  token1,
  chainId,
}) => {
  const [open0, setOpen0] = useState(false)
  const [open1, setOpen1] = useState(false)

  const close0 = useCallback(() => {
    setOpen0(false)
  }, [])

  const close1 = useCallback(() => {
    setOpen1(false)
  }, [])

  return (
    <Widget id="selectPoolTokensWidget" maxWidth={400} className="!bg-slate-800">
      <Widget.Content>
        <Widget.Header title="2. Pool Tokens" />
        <div className="flex gap-4 p-4 pt-0 items-center">
          <Button
            fullWidth
            {...(token0 && { startIcon: <Currency.Icon currency={token0} width={24} height={24} /> })}
            className={classNames('!font-semibold justify-between', token0 ? '!bg-slate-700' : '')}
            endIcon={<ChevronDownIcon width={20} height={20} />}
            onClick={() => setOpen0(true)}
          >
            {token0?.symbol ?? `Token A`}
          </Button>
          <Button
            fullWidth
            {...(token1 && { startIcon: <Currency.Icon currency={token1} width={24} height={24} /> })}
            className={classNames('!font-semibold justify-between', token1 ? '!bg-slate-700' : '')}
            endIcon={<ChevronDownIcon width={20} height={20} />}
            onClick={() => setOpen1(true)}
          >
            {token1?.symbol ?? `Token B`}
          </Button>
        </div>
        <TokenSelector
          id="select-pool-tokens-widget-token0"
          variant="dialog"
          onClose={close0}
          open={open0}
          fundSource={FundSource.WALLET}
          chainId={chainId}
          currency={token0}
          onSelect={onSelectToken0}
          onAddToken={onAddToken}
          onRemoveToken={onRemoveToken}
          tokenMap={tokenMap}
          customTokenMap={customTokenMap}
          includeNative={true}
        />
        <TokenSelector
          id="select-pool-tokens-widget-token1"
          variant="dialog"
          onClose={close1}
          open={open1}
          fundSource={FundSource.WALLET}
          chainId={chainId}
          currency={token1}
          onSelect={onSelectToken1}
          onAddToken={onAddToken}
          onRemoveToken={onRemoveToken}
          tokenMap={tokenMap}
          customTokenMap={customTokenMap}
          includeNative={true}
        />
      </Widget.Content>
    </Widget>
  )
}
