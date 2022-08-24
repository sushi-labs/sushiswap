import { AddressZero } from '@ethersproject/constants'
import { PlusIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Button, Dots } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { useBalances, Wallet, Web3Input } from '@sushiswap/wagmi'
import { FC, useMemo } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

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
  isWritePending: boolean
  onReview(): void
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
  onReview,
  isWritePending,
}) => {
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const tokenMap = useTokens(chainId)
  const { address } = useAccount()
  const { switchNetwork } = useSwitchNetwork()
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const { data: balances } = useBalances({ chainId, account: address, currencies: [token0, token1] })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const insufficientBalance =
    token0 && token1
      ? (parsedInput0 &&
          balances?.[token0.isNative ? AddressZero : token0.wrapped.address]?.[FundSource.WALLET]?.lessThan(
            parsedInput0
          )) ||
        (parsedInput1 &&
          balances?.[token1.isNative ? AddressZero : token1.wrapped.address]?.[FundSource.WALLET]?.lessThan(
            parsedInput1
          ))
      : undefined

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
          <div className="p-3">
            {isMounted && !address ? (
              <Wallet.Button appearOnMount={false} fullWidth color="blue" size="md">
                Connect Wallet
              </Wallet.Button>
            ) : isMounted && chain && chain.id !== chainId ? (
              <Button size="md" fullWidth onClick={() => switchNetwork && switchNetwork(chainId)}>
                Switch to {Chain.from(chainId).name}
              </Button>
            ) : !parsedInput0 || !parsedInput1 ? (
              <Button size="md" fullWidth disabled>
                Enter Amounts
              </Button>
            ) : insufficientBalance ? (
              <Button size="md" fullWidth disabled>
                Insufficient Balance
              </Button>
            ) : (
              <Button fullWidth size="md" variant="filled" disabled={isWritePending} onClick={onReview}>
                {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add Liquidity'}
              </Button>
            )}
          </div>
        </div>
      </Widget.Content>
    </Widget>
  )
}
