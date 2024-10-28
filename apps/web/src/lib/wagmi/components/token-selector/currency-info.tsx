import { XMarkIcon } from '@heroicons/react/20/solid'
import {
  ArrowLeftIcon,
  ChartBarSquareIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
import {
  ExclamationTriangleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid'
import {
  Button,
  ClipboardController,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
  Explainer,
  IconButton,
  LinkExternal,
  Loader,
  SelectIcon,
  Separator,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { GoPlusLabsIcon } from '@sushiswap/ui/icons/GoPlusLabsIcon'
import { FC, useMemo, useState } from 'react'
import {
  TokenSecurity,
  TokenSecurityLabel,
  TokenSecurityMessage,
  isTokenSecurityIssue,
  useCoinGeckoTokenInfo,
  useTokenSecurity,
} from 'src/lib/hooks/react-query'
import { Chain } from 'sushi/chain'
import { Type } from 'sushi/currency'
import { formatNumber, formatUSD, shortenAddress } from 'sushi/format'

interface CurrencyInfoProps {
  currency: Type
  onBack: () => void
}

export const CurrencyInfo: FC<CurrencyInfoProps> = ({ currency, onBack }) => {
  const { data: tokenSecurityInfo, isLoading: isTokenSecurityInfoLoading } =
    useTokenSecurity({
      currencies: useMemo(() => [currency.wrapped], [currency]),
    })

  const { data: coinGeckoInfo, isLoading: isCoinGeckoInfoLoading } =
    useCoinGeckoTokenInfo({
      token: currency.wrapped,
    })

  const [showMore, setShowMore] = useState(false)

  const { tokenSecurity, issues, nonIssues } = useMemo(() => {
    const tokenSecurity = tokenSecurityInfo?.[currency.wrapped.address]
    const issues: (keyof TokenSecurity)[] = []
    const nonIssues: (keyof TokenSecurity)[] = []

    for (const [_key, value] of Object.entries(tokenSecurity || {})) {
      const key = _key as keyof TokenSecurity
      if (key in isTokenSecurityIssue && isTokenSecurityIssue[key](value))
        issues.push(key)
      else nonIssues.push(key)
    }

    return { tokenSecurity, issues, nonIssues }
  }, [tokenSecurityInfo, currency.wrapped])

  return (
    <div className="absolute inset-0 z-20 bg-gray-100 dark:bg-slate-800 flex flex-col gap-4 py-6 rounded-2xl md:rounded-r-2xl">
      <DialogHeader className="px-6 flex !flex-row justify-between items-center">
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
              {Chain.from(currency.chainId)?.name}
            </span>
          </div>
        </DialogTitle>
        <DialogPrimitive.Close asChild>
          <IconButton icon={XMarkIcon} name="Close" />
        </DialogPrimitive.Close>
      </DialogHeader>
      <div className="px-6 overflow-y-auto">
        <div>
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
                  href={Chain.from(currency.chainId)?.getTokenUrl(
                    currency.wrapped.address,
                  )}
                >
                  {shortenAddress(currency.wrapped.address)}
                </LinkExternal>
                <ClipboardController hideTooltip>
                  {({ setCopied }) => (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DocumentDuplicateIcon
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => setCopied(currency.wrapped.address)}
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
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">Token Security</span>
              <div className="flex items-center text-xs">
                powered by GoPlus
                <GoPlusLabsIcon width={16} height={20} />
              </div>
            </div>
            <div>
              <div
                className={classNames(
                  'rounded-full flex items-center px-2 py-1.5 gap-1',
                  isTokenSecurityInfoLoading
                    ? 'bg-muted'
                    : Number(issues?.length) > 0
                      ? 'bg-yellow/20 text-yellow'
                      : 'bg-green/20 text-green',
                )}
              >
                {isTokenSecurityInfoLoading ? (
                  <Loader width={16} height={16} />
                ) : Number(issues?.length) > 0 ? (
                  <ExclamationTriangleIcon width={16} height={16} />
                ) : (
                  <HandThumbUpIcon width={16} height={16} />
                )}
                {isTokenSecurityInfoLoading ? (
                  <span className="text-sm">Pending</span>
                ) : (
                  <span className="text-sm">{`${Number(issues?.length)} issue${
                    Number(issues?.length) !== 1 ? 's' : ''
                  } found`}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {isTokenSecurityInfoLoading ? <SkeletonText /> : null}
            {issues.map((key) => (
              <div key={key} className="flex justify-between">
                <div className="flex gap-1 text-muted-foreground">
                  {TokenSecurityLabel[key]}
                  <Explainer>{TokenSecurityMessage[key]}</Explainer>
                </div>
                <div className="flex items-center gap-1">
                  <div>
                    {tokenSecurity?.[key] === undefined
                      ? 'Unknown'
                      : tokenSecurity[key]
                        ? 'Yes'
                        : 'No'}
                  </div>
                  <ExclamationTriangleIcon
                    width={14}
                    height={14}
                    className="fill-yellow"
                  />
                </div>
              </div>
            ))}
            {showMore
              ? nonIssues.map((key) => (
                  <div
                    key={key}
                    className="flex justify-between text-muted-foreground"
                  >
                    <div className="flex gap-1 text-muted-foreground">
                      {TokenSecurityLabel[key]}
                      <Explainer>{TokenSecurityMessage[key]}</Explainer>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{tokenSecurity?.[key] ? 'Yes' : 'No'}</span>
                      <HandThumbUpIcon
                        width={14}
                        height={14}
                        className="fill-green"
                      />
                    </div>
                  </div>
                ))
              : null}
            <Button
              size="xs"
              fullWidth
              onClick={() => setShowMore(!showMore)}
              variant="secondary"
            >
              {showMore ? (
                <>
                  <SelectIcon className="rotate-180" />
                </>
              ) : (
                <>
                  <SelectIcon />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
