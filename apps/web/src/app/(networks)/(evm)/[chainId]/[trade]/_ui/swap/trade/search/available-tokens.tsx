import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { Badge, Button, Currency, SkeletonBox, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import { useSwapTokenSelect } from 'src/lib/hooks/useTokenSelect'
import { usePortfolioWallet } from 'src/lib/wagmi/components/user-portfolio/hooks/use-portfolio-wallet'
import { Connect } from 'src/lib/wagmi/systems/Checker/connect'
import { formatNumber } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { EvmNative, EvmToken } from 'sushi/evm'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PayWithFiat } from './pay-with-fiat'

export const AvailableTokens = () => {
  const { address } = useAccount()
  const { data, isError, isLoading } = usePortfolioWallet({ address })

  const firstFiveTokens = useMemo(() => {
    if (isLoading || isError || !data) return []
    return data?.tokens?.slice(0, 5)
  }, [data, isError, isLoading])

  if (!address) {
    return <Connect variant="secondary" className="w-full" />
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <h4 className="hidden md:block text-[#535263] font-medium dark:text-[#E4DDEC] text-sm">
        Available
      </h4>
      <div className="flex items-center  gap-2 overflow-x-auto whitespace-nowrap md:flex md:flex-wrap md:gap-3 hide-scrollbar">
        {isLoading ? (
          new Array(6)
            .fill(null)
            .map((_, index) => (
              <SkeletonBox
                key={index}
                className="!bg-secondary min-w-[120px] md:min-w-fit !rounded-full h-[40px]"
              />
            ))
        ) : isError ? (
          <div className="pt-4 text-sm text-center text-red">
            Could Not Fetch Wallet Holdings
          </div>
        ) : !firstFiveTokens.length ? (
          <div className="text-sm mt-2 text-[#64748B] text-center">
            No Tokens Found
          </div>
        ) : (
          <>
            {firstFiveTokens?.map((token) => (
              <TokenOption key={`${token.chainId}:${token.id}`} token={token} />
            ))}
            <PayWithFiat />
          </>
        )}
      </div>
    </div>
  )
}

const TokenOption = ({ token }: { token: PortfolioWalletToken }) => {
  const isNative = !token?.id?.startsWith('0x')

  const { handleTokenInput } = useSwapTokenSelect()
  const _token = useMemo(
    () =>
      isNative
        ? EvmNative.fromChainId(token.chainId as EvmChainId)
        : new EvmToken({
            address: token.id as Address,
            name: token.name,
            symbol: token.symbol,
            chainId: token.chainId as EvmChainId,
            decimals: token.decimals,
          }),
    [token, isNative],
  )
  return (
    <Button
      onClick={async () => {
        await handleTokenInput({ token: _token })
      }}
      variant={'secondary'}
      id={`token-option-${token.chainId}-${token.id}`}
      type="button"
      className={classNames(
        '!rounded-full flex w-fit !justify-start !pl-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent dark:!bg-[#0D1227] dark:hover:!bg-white/10',
      )}
    >
      <Badge
        className="border border-slate-50 dark:border-slate-900 rounded-[4px] z-[11] -bottom-[2%]"
        position="bottom-right"
        badgeContent={
          <NetworkIcon
            type="square"
            className="rounded-[3px]"
            chainId={token.chainId}
            width={12}
            height={12}
          />
        }
      >
        <Currency.Icon disableLink currency={_token} width={24} height={24} />
      </Badge>

      <div className="flex items-start gap-1">
        <span>{formatNumber(token.amount, 2)}</span>
        <span>{token.symbol}</span>
      </div>
    </Button>
  )
}
