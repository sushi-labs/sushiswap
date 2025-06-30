import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { Badge, Button, Currency, SkeletonBox, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { getNetworkKey } from 'src/lib/network'
import { usePortfolioWallet } from 'src/lib/wagmi/components/user-portfolio/hooks/use-portfolio-wallet'
import { Connect } from 'src/lib/wagmi/systems/Checker/Connect'
import type { ChainId, EvmChainId } from 'sushi'
import { Native, Token } from 'sushi/currency'
import { formatNumber } from 'sushi/format'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
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
      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap md:grid md:grid-cols-3 md:gap-2 hide-scrollbar">
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
  const isNative = !token.id.startsWith('0x')
  const { createQuery } = useCreateQuery()
  const { switchChainAsync } = useSwitchChain()
  return (
    <Button
      onClick={async () => {
        await switchChainAsync({ chainId: token?.chainId as EvmChainId })
        createQuery(
          [
            { name: 'token0', value: isNative ? 'NATIVE' : token.id },
            { name: 'chainId0', value: String(token.chainId) },
          ],
          `/${getNetworkKey(token?.chainId as ChainId)}/swap/advanced`,
        )
      }}
      variant={'secondary'}
      id={`token-option-${token.chainId}-${token.id}`}
      type="button"
      className={classNames(
        '!rounded-full focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent',
      )}
    >
      <Badge
        className="border border-slate-50 dark:border-slate-900 rounded-[4px] z-[11]"
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

      <div className="flex items-start gap-1">
        <span>{formatNumber(token.amount, 2)}</span>
        <span>{token.symbol}</span>
      </div>
    </Button>
  )
}
