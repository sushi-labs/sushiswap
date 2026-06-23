import {
  ArrowLeftIcon,
  ChartBarSquareIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  ClipboardController,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
  IconButton,
  LinkExternal,
  Separator,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import {
  useCoinGeckoTokenInfo,
  useTokenSecurity,
} from 'src/lib/hooks/react-query'
import { formatNumber, formatUSD, getChainById, shortenAddress } from 'sushi'
import type { EvmToken } from 'sushi/evm'
import { type StellarToken, isStellarChainId } from 'sushi/stellar'
import type { SvmToken } from 'sushi/svm'
import { TokenSecurityView } from '../token-security-view'
import type { TokenSelectorChainId } from './config'

interface CurrencyInfoProps<TChainId extends TokenSelectorChainId> {
  currency: CurrencyFor<TChainId>
  onBack: () => void
}

export function CurrencyInfo<TChainId extends TokenSelectorChainId>({
  currency,
  onBack,
}: CurrencyInfoProps<TChainId>) {
  const token = currency.wrap() as EvmToken | SvmToken | StellarToken

  const { data: coinGeckoInfo, isLoading: isCoinGeckoInfoLoading } =
    useCoinGeckoTokenInfo({
      token,
    })

  return (
    <div className="absolute inset-0 z-20 py-6 bg-gray-100 dark:bg-slate-800 rounded-2xl">
      <DialogPrimitive.Close asChild className="absolute top-6 right-6">
        <IconButton icon={XMarkIcon} name="Close" />
      </DialogPrimitive.Close>
      <div className="flex flex-col gap-4 h-full">
        <DialogHeader className="px-6">
          <DialogTitle className="flex gap-2 items-center">
            <IconButton
              size="sm"
              onClick={onBack}
              icon={ArrowLeftIcon}
              name="Back"
              variant="ghost"
            />
            <div className="flex gap-1 items-center">
              <span className="text-xl font-medium">{currency.symbol}</span>
              <span className="text-muted-foreground text-base font-normal">
                {getChainById(currency.chainId).name}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 overflow-y-auto">
          <div className="flex gap-1 items-center py-2">
            <ChartBarSquareIcon className="h-4 w-4" />
            <span className="font-medium">Market Info</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Price</span>
              {isCoinGeckoInfoLoading ? (
                <span className="w-12">
                  <SkeletonText fontSize="sm" />
                </span>
              ) : (
                <span className="text-sm">
                  {coinGeckoInfo?.price ? formatUSD(coinGeckoInfo.price) : '-'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Market Cap Rank
              </span>
              {isCoinGeckoInfoLoading ? (
                <span className="w-12">
                  <SkeletonText fontSize="sm" />
                </span>
              ) : (
                <span className="text-sm">
                  {coinGeckoInfo?.rank ? `#${coinGeckoInfo.rank}` : '-'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Trading Volume (24H)
              </span>
              {isCoinGeckoInfoLoading ? (
                <span className="w-12">
                  <SkeletonText fontSize="sm" />
                </span>
              ) : (
                <span className="text-sm">
                  {coinGeckoInfo?.volume24h
                    ? formatUSD(coinGeckoInfo.volume24h)
                    : '-'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Market Cap</span>
              {isCoinGeckoInfoLoading ? (
                <span className="w-12">
                  <SkeletonText fontSize="sm" />
                </span>
              ) : (
                <span className="text-sm">
                  {coinGeckoInfo?.marketCap
                    ? formatUSD(coinGeckoInfo.marketCap)
                    : '-'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                All-Time High
              </span>
              {isCoinGeckoInfoLoading ? (
                <span className="w-12">
                  <SkeletonText fontSize="sm" />
                </span>
              ) : (
                <span className="text-sm">
                  {coinGeckoInfo?.ath ? formatUSD(coinGeckoInfo.ath) : '-'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                All-Time Low
              </span>
              {isCoinGeckoInfoLoading ? (
                <span className="w-12">
                  <SkeletonText fontSize="sm" />
                </span>
              ) : (
                <span className="text-sm">
                  {coinGeckoInfo?.atl ? formatUSD(coinGeckoInfo.atl) : '-'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Circulating Supply
              </span>
              {isCoinGeckoInfoLoading ? (
                <span className="w-12">
                  <SkeletonText fontSize="sm" />
                </span>
              ) : (
                <span className="text-sm">
                  {coinGeckoInfo?.circulatingSupply
                    ? formatNumber(coinGeckoInfo.circulatingSupply)
                    : '-'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Total Supply
              </span>
              {isCoinGeckoInfoLoading ? (
                <span className="w-12">
                  <SkeletonText fontSize="sm" />
                </span>
              ) : (
                <span className="text-sm">
                  {coinGeckoInfo?.totalSupply
                    ? formatNumber(coinGeckoInfo.totalSupply)
                    : '-'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Contract Address
              </span>
              <span className="flex gap-1 items-center">
                <LinkExternal
                  className="font-medium"
                  href={getChainById(currency.chainId).getTokenUrl(
                    // Chain-specific address types collapse under the union here.
                    currency.wrap().address as never,
                  )}
                >
                  {shortenAddress(currency.wrap().address)}
                </LinkExternal>
                <ClipboardController hideTooltip>
                  {({ setCopied }) => (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DocumentDuplicateIcon
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => setCopied(currency.wrap().address)}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Copy address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </ClipboardController>
              </span>
            </div>
            <CurrencyInfoIssuerDomain currency={currency} />
          </div>
          <CurrencySecurity currency={currency} />
        </div>
      </div>
    </div>
  )
}

function CurrencyInfoIssuerDomain<TChainId extends TokenSelectorChainId>({
  currency,
}: {
  currency: CurrencyFor<TChainId>
}) {
  const isStellarCurrency = isStellarChainId(currency.chainId)
  const stellarToken = isStellarCurrency
    ? (currency.wrap() as StellarToken<{ domain?: string }>)
    : undefined

  if (!stellarToken) return null

  return (
    <>
      <div className="flex justify-between">
        <span className="text-muted-foreground text-sm">Issuer</span>
        <span className="text-sm">
          {stellarToken.issuer ? shortenAddress(stellarToken.issuer) : '-'}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground text-sm">Domain</span>
        <span className="text-sm">{stellarToken.metadata.domain ?? '-'}</span>
      </div>
    </>
  )
}

function CurrencySecurity<TChainId extends TokenSelectorChainId>({
  currency,
}: {
  currency: CurrencyFor<TChainId>
}) {
  const token = isStellarChainId(currency.chainId)
    ? undefined
    : (currency.wrap() as TokenFor<typeof currency.chainId>)

  const { data: tokenSecurity, isLoading: isTokenSecurityLoading } =
    useTokenSecurity({
      currency: token,
    })

  if (!token) return null

  return (
    <>
      <Separator className="my-6" />
      <div className="flex flex-col">
        <div className="flex gap-1 items-center py-2">
          <ShieldCheckIcon className="h-4 w-4" />
          <span className="font-medium">Security Info</span>
        </div>
        <TokenSecurityView
          token={token}
          isTokenSecurityLoading={isTokenSecurityLoading}
          tokenSecurity={tokenSecurity}
        />
      </div>
    </>
  )
}
