import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { Badge, Button, Currency, SkeletonBox, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import { usePortfolioWallet } from 'src/lib/wagmi/components/user-portfolio/hooks/use-portfolio-wallet'
import { Connect } from 'src/lib/wagmi/systems/Checker/Connect'
import type { EvmChainId } from 'sushi'
import { Native, Token } from 'sushi/currency'
import { formatNumber } from 'sushi/format'
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
    <div className="flex flex-col gap-2 w-full">
      <h4 className="hidden md:block">Available</h4>
      <div className="flex gap-2 items-center whitespace-nowrap md:grid md:grid-cols-3 md:gap-2 hide-scrollbar overflow-x-auto">
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
          <div className="text-center text-red text-sm pt-4">
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
  const isNative = !token.id.startsWith('0x')
  //TODO: select logic with provider
  return (
    <Button
      variant={'secondary'}
      id={`token-option-${token.chainId}-${token.id}`}
      type="button"
      className={classNames('!rounded-full')}
    >
      <Badge
        className="border border-slate-50 dark:border-slate-900 rounded-full z-[11]"
        position="bottom-right"
        badgeContent={
          <NetworkIcon chainId={token.chainId} width={12} height={12} />
        }
      >
        <Currency.Icon
          disableLink
          currency={
            isNative
              ? Native.onChain(token.chainId as EvmChainId)
              : new Token({
                  address: token.id,
                  name: token.name,
                  symbol: token.symbol,
                  chainId: token.chainId as EvmChainId,
                  decimals: token.decimals,
                })
          }
          width={24}
          height={24}
        />
      </Badge>

      <div className="flex gap-1 items-start">
        <span>{token.symbol}</span>
        <span>{formatNumber(token.amount, 2)}</span>
      </div>
    </Button>
  )
}
