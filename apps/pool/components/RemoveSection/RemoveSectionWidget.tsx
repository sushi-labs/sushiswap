import { Transition } from '@headlessui/react'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames, Currency as UICurrency, DEFAULT_INPUT_UNSTYLED, Input, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { useBalance, useTotalSupply } from '@sushiswap/wagmi'
import { FC, Fragment, ReactNode } from 'react'
import { useAccount } from 'wagmi'

import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPair } from '../../lib/hooks'

interface RemoveSectionWidgetProps {
  chainId: ChainId
  percentage: number
  liquidityToken: Token
  token0: Type
  token1: Type
  reserve0: Amount<Token> | undefined
  reserve1: Amount<Token> | undefined
  setPercentage(percentage: number): void
  error?: string
  children: ReactNode
}

export const RemoveSectionWidget: FC<RemoveSectionWidgetProps> = ({
  chainId,
  percentage,
  setPercentage,
  liquidityToken,
  token0,
  token1,
  reserve0,
  reserve1,
  children,
  error,
}) => {
  const { address } = useAccount()
  const { data: balance } = useBalance({ chainId, account: address, currency: liquidityToken })
  const totalSupply = useTotalSupply(liquidityToken)

  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0,
    reserve1,
    totalSupply,
    balance: balance?.[FundSource.WALLET].wrapped,
  })

  const [underlying0, underlying1] = underlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId, amounts: underlying })

  return (
    <Widget id="addLiquidity" maxWidth={400} className="bg-slate-800">
      <Widget.Content>
        <Widget.Header title="Remove Liquidity" />
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-grow justify-between items-center">
              <Input.Numeric
                onUserInput={(val) => setPercentage(Number(val))}
                value={percentage}
                placeholder="0"
                variant="unstyled"
                className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
              />
            </div>
            <div className="flex gap-2">
              <Button size="xs" onClick={() => setPercentage(25)}>
                25%
              </Button>
              <Button size="xs" onClick={() => setPercentage(50)}>
                50%
              </Button>
              <Button size="xs" onClick={() => setPercentage(75)}>
                75%
              </Button>
              <Button size="xs" onClick={() => setPercentage(100)}>
                MAX
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 pb-2 justify-between items-center">
            <Transition
              appear
              as={Fragment}
              show={Boolean(balance?.[FundSource.WALLET])}
              enter="transition duration-300 origin-center ease-out"
              enterFrom="transform scale-90 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform opacity-100"
              leaveTo="transform opacity-0"
            >
              <Typography variant="sm" weight={500} className="text-slate-300 hover:text-slate-20">
                {formatUSD((Number(value0) + Number(value1)) * (percentage / 100))}
              </Typography>
            </Transition>
            <Transition
              appear
              show={Boolean(balance?.[FundSource.WALLET])}
              as={Fragment}
              enter="transition duration-300 origin-center ease-out"
              enterFrom="transform scale-90 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform opacity-100"
              leaveTo="transform opacity-0"
            >
              <Typography
                onClick={() => setPercentage(100)}
                as="button"
                variant="sm"
                weight={500}
                className="col-span-2 justify-end flex text-slate-300 hover:text-slate-200 truncate"
              >
                Balance: {balance?.[FundSource.WALLET].toSignificant(6)}
              </Typography>
            </Transition>
          </div>
          <Transition
            show={Boolean(percentage > 0 && underlying0 && underlying1)}
            unmount={false}
            className="transition-[max-height] overflow-hidden"
            enter="duration-300 ease-in-out"
            enterFrom="transform max-h-0"
            enterTo="transform max-h-[380px]"
            leave="transition-[max-height] duration-250 ease-in-out"
            leaveFrom="transform max-h-[380px]"
            leaveTo="transform max-h-0"
          >
            <div className="py-3 pt-5 flex flex-col gap-3 border-t border-slate-200/5">
              <Typography variant="sm" weight={400} className="text-slate-400 pb-1">
                You&apos;ll receive
              </Typography>

              <div className="flex items-center justify-between">
                <Typography variant="sm" weight={500} className="flex gap-2 items-center text-slate-50">
                  {token0 && <UICurrency.Icon currency={token0} width={20} height={20} />}
                  <span className="text-slate-400">
                    <span className="text-slate-50">{underlying0?.toSignificant(6)}</span>{' '}
                    {Native.onChain(chainId).wrapped === token0
                      ? Native.onChain(chainId).symbol
                      : underlying0?.currency.symbol}
                  </span>
                </Typography>
                <Typography variant="xs" className="text-slate-400">
                  {formatUSD(Number(value0))}
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <Typography variant="sm" weight={500} className="flex gap-2 items-center text-slate-50">
                  {token1 && <UICurrency.Icon currency={token1} width={20} height={20} />}
                  <span className="text-slate-400">
                    <span className="text-slate-50">{underlying1?.toSignificant(6)}</span>{' '}
                    {Native.onChain(chainId).wrapped === token1
                      ? Native.onChain(chainId).symbol
                      : underlying1?.currency.symbol}
                  </span>
                </Typography>
                <Typography variant="xs" className="text-slate-400">
                  {formatUSD(Number(value1))}
                </Typography>
              </div>
            </div>
          </Transition>
          {children}
          {error && (
            <Typography variant="xs" className="text-center text-red mt-4" weight={500}>
              {error}
            </Typography>
          )}
        </div>
      </Widget.Content>
    </Widget>
  )
}
