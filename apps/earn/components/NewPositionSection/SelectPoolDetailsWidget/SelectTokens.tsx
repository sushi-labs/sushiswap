import { ChevronDownIcon } from '@heroicons/react/solid'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames, Currency } from '@sushiswap/ui'
import { TokenSelector } from '@sushiswap/wagmi'
import React, { FC, useCallback, useState } from 'react'

import { useCustomTokens } from '../../../lib/state/storage'
import { useTokens } from '../../../lib/state/token-lists'
import { useAddPositionActions, useAddPositionState } from '../../AddPositionProvider'

export const SelectTokens: FC = () => {
  const { chainId, token0, token1 } = useAddPositionState()
  const { setToken0, setToken1 } = useAddPositionActions()

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)

  const [open0, setOpen0] = useState(false)
  const [open1, setOpen1] = useState(false)
  const close0 = useCallback(() => setOpen0(false), [])
  const close1 = useCallback(() => setOpen1(false), [])

  return (
    <div className="flex justify-between gap-3 py-3">
      <p className="text-sm font-medium text-slate-300">Tokens</p>
      <div className="flex flex-col gap-2 items-center">
        <Button
          size="sm"
          fullWidth
          color={token0 ? 'gray' : 'blue'}
          {...(token0 && { startIcon: <Currency.Icon currency={token0} width={24} height={24} /> })}
          className={classNames(
            '!font-semibold justify-between !rounded-lg',
            token0 ? '!bg-white/[0.04] border border-slate-200/10' : ''
          )}
          endIcon={<ChevronDownIcon width={20} height={20} />}
          onClick={() => setOpen0(true)}
        >
          {token0?.symbol ?? `Token A`}
        </Button>
        <Button
          size="sm"
          fullWidth
          color={token1 ? 'gray' : 'blue'}
          {...(token1 && { startIcon: <Currency.Icon currency={token1} width={24} height={24} /> })}
          className={classNames(
            '!font-semibold justify-between !rounded-lg',
            token1 ? '!bg-white/[0.04] border border-slate-200/10' : ''
          )}
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
        onSelect={setToken0}
        onAddToken={addCustomToken}
        onRemoveToken={removeCustomToken}
        tokenMap={tokenMap}
        customTokenMap={customTokensMap}
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
        onSelect={setToken1}
        onAddToken={addCustomToken}
        onRemoveToken={removeCustomToken}
        tokenMap={tokenMap}
        customTokenMap={customTokensMap}
        includeNative={true}
      />
    </div>
  )
}
