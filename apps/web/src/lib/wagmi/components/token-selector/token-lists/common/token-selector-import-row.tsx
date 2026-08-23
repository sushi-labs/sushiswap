import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import {
  Badge,
  Button,
  Currency,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LinkExternal,
  List,
  Loader,
  Message,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/unknown-token-icon'
import { useCallback, useState } from 'react'
import { useTokenSecurity } from 'src/lib/hooks/react-query/tokens/use-token-security'
import { getChainById, shortenAddress } from 'sushi'
import type { EvmToken } from 'sushi/evm'
import { isStellarChainId } from 'sushi/stellar'
import type { SvmToken } from 'sushi/svm'
import { TokenSecurityImportActions } from '../../../token-security-import-actions'
import { getTokenSecurityImportState } from '../../../token-security-import-state'
import { TokenSecurityView } from '../../../token-security-view'
import type { TokenSelectorChainId } from '../../config'
import type { TokenApprovalStatus } from '../../hooks/token-list-token'
import { useTokenSelectorTheme } from '../../token-selector-theme'
import { shouldBypassTokenSecurityCheck } from './token-security-import-policy'

interface TokenSelectorImportRow<TChainId extends TokenSelectorChainId> {
  currency: TokenFor<TChainId, { approvalStatus?: TokenApprovalStatus }>
  onImport(): void
}

export function TokenSelectorImportRow<TChainId extends TokenSelectorChainId>({
  currency,
  onImport,
}: TokenSelectorImportRow<TChainId>) {
  const theme = useTokenSelectorTheme()
  const isPerps = theme === 'perps'
  const [open, setOpen] = useState(false)
  const bypassTokenSecurityCheck = shouldBypassTokenSecurityCheck({
    chainId: currency.chainId,
    approvalStatus: currency.metadata.approvalStatus,
  })
  console.log(currency, bypassTokenSecurityCheck, 'bypassTokenSecurityCheck')
  const securityCurrency = isStellarChainId(currency.chainId)
    ? undefined
    : (currency as EvmToken | SvmToken)
  const {
    data: tokenSecurity,
    isError: isTokenSecurityError,
    isFetching: isTokenSecurityFetching,
    isLoading: isTokenSecurityLoading,
    refetch: refetchTokenSecurity,
  } = useTokenSecurity({
    currency: securityCurrency,
    enabled: open && !bypassTokenSecurityCheck,
  })
  const tokenSecurityImportState = getTokenSecurityImportState({
    required: Boolean(securityCurrency),
    isLoading: isTokenSecurityLoading,
    isFetching: isTokenSecurityFetching,
    isError: isTokenSecurityError,
    isAvailable: tokenSecurity?.isAvailable,
  })
  const isTokenSecurityScanning = tokenSecurityImportState === 'scanning'
  const hasSecurityRisk = Boolean(
    tokenSecurity?.isHoneypot || tokenSecurity?.isFoT || tokenSecurity?.isRisky,
  )

  const onClick = useCallback(() => {
    onImport()

    setTimeout(() => {
      setOpen(false)
    }, 250)
  }, [onImport])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative py-0.5 h-[64px]">
        <div
          className={classNames(
            'flex h-full max-w-full items-center rounded-lg px-3',
            isPerps
              ? 'hover:bg-white/[0.05] focus:bg-white/[0.07]'
              : 'hover:bg-muted focus:bg-accent',
          )}
        >
          <div className="flex min-w-0 flex-1 flex-row items-center gap-4">
            <div className="w-10 h-10 shrink-0">
              <Currency.Icon
                disableLink
                currency={currency}
                width={40}
                height={40}
              />
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <span
                className={classNames(
                  'font-semibold',
                  isPerps
                    ? 'text-perps-muted'
                    : 'text-gray-900 group-hover:text-gray-900 dark:text-slate-50 dark:group-hover:text-white',
                )}
              >
                {currency.symbol}
              </span>
              <span
                className={classNames(
                  'max-w-full truncate text-sm',
                  isPerps
                    ? 'text-perps-muted-50'
                    : 'text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100',
                )}
              >
                {currency.name}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col">
            {bypassTokenSecurityCheck ? (
              <TraceEvent
                events={[BrowserEvent.onClick, BrowserEvent.onKeyPress]}
                name={InterfaceEventName.TOKEN_IMPORTED}
                properties={{
                  token_symbol: currency.symbol,
                  token_address: currency.address,
                }}
                element={InterfaceElementName.IMPORT_TOKEN_BUTTON}
              >
                <Button
                  size="xs"
                  variant={isPerps ? 'perps-default' : 'default'}
                  onClick={onClick}
                >
                  Import
                </Button>
              </TraceEvent>
            ) : (
              <DialogTrigger asChild>
                <Button
                  size="xs"
                  variant={isPerps ? 'perps-default' : 'default'}
                  onClick={() => setOpen(true)}
                >
                  Import
                </Button>
              </DialogTrigger>
            )}
          </div>
        </div>
      </div>
      <DialogContent
        className={classNames(
          '!flex max-h-[calc(100dvh-16px)] flex-col overflow-hidden md:max-h-[80vh]',
          isPerps &&
            '!border !border-white/[0.07] !bg-perps-background !text-perps-muted',
        )}
      >
        <DialogHeader className="!text-left !space-y-3 shrink-0">
          <DialogTitle>
            <div
              className={classNames(
                'inline-flex items-center px-2 py-1.5 gap-1 rounded-full',
                isTokenSecurityScanning
                  ? 'bg-muted'
                  : hasSecurityRisk
                    ? 'bg-red/20 text-red'
                    : 'bg-yellow/20 text-yellow',
              )}
            >
              {isTokenSecurityScanning ? (
                <div className="w-7 h-7 flex justify-center items-center">
                  <Loader width={28} height={28} />
                </div>
              ) : hasSecurityRisk ? (
                <ExclamationTriangleIcon width={28} height={28} />
              ) : (
                <ExclamationCircleIcon width={28} height={28} />
              )}
            </div>
          </DialogTitle>
          {isTokenSecurityScanning ? (
            <span className="w-52">
              <SkeletonText fontSize="xl" />
            </span>
          ) : (
            <span className="text-xl font-semibold">
              {tokenSecurity?.isHoneypot
                ? 'Honeypot Token Detected'
                : tokenSecurity?.isFoT
                  ? 'Tax Token Deteceted'
                  : tokenSecurity?.isRisky
                    ? 'Token Flagged for Risks'
                    : 'Unverified Token'}
            </span>
          )}
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <List>
              <List.Control
                className={classNames(
                  '!p-4',
                  isPerps &&
                    '!border-white/[0.06] !bg-white/[0.02] shadow-none',
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Badge
                      position="bottom-right"
                      badgeContent={
                        <div className="bg-white rounded-full dark:bg-slate-800">
                          <NetworkIcon
                            width={20}
                            height={20}
                            chainId={currency.chainId}
                          />
                        </div>
                      }
                    >
                      <div className="w-10 h-10">
                        <UnknownTokenIcon width={40} height={40} />
                      </div>
                    </Badge>
                    <div className="flex flex-col">
                      <span className="text-2xl font-medium">
                        {currency.symbol ?? '-'}
                      </span>
                      <span className="font-medium text-muted-foreground">
                        {currency.name ?? '-'}
                      </span>
                    </div>
                  </div>
                  <LinkExternal
                    target="_blank"
                    href={getChainById(currency.chainId).getTokenUrl(
                      // Chain-specific address types collapse under the union here.
                      currency.address as never,
                    )}
                    className="font-medium"
                  >
                    {shortenAddress(currency.address)}{' '}
                  </LinkExternal>
                </div>
              </List.Control>
            </List>
            {securityCurrency ? (
              <List className="!pt-0 overflow-hidden">
                <List.Control
                  className={classNames(
                    '!flex !flex-col !gap-3 !overflow-y-auto !p-4',
                    isPerps &&
                      '!border-white/[0.06] !bg-white/[0.02] shadow-none',
                  )}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      Token Security Scan
                    </span>
                  </div>
                  {tokenSecurityImportState === 'unavailable' ? (
                    <span className="text-sm text-muted-foreground">
                      Security providers did not return results for this token.
                    </span>
                  ) : (
                    <TokenSecurityView
                      token={securityCurrency}
                      tokenSecurity={tokenSecurity}
                      isTokenSecurityLoading={isTokenSecurityScanning}
                    />
                  )}
                </List.Control>
              </List>
            ) : null}
          </div>
        </div>
        <Message
          size="sm"
          variant={hasSecurityRisk ? 'destructive' : 'warning'}
        >
          {tokenSecurity?.isHoneypot
            ? 'Honeypot tokens restrict selling. Sushi does not support this token type.'
            : tokenSecurityImportState === 'unavailable'
              ? 'The token security scan is unavailable. Retry the scan or explicitly import without security results.'
              : tokenSecurity?.isFoT
                ? 'This token charges a tax fee on transfer. Tax tokens are not supported in V3. You might not be able to trade, transfer, or withdraw liquidity of this token.'
                : tokenSecurity?.isRisky
                  ? 'Our security scan has identified risks associated with this token. Proceeding may result in the loss of your funds. Please exercise caution and review the details before continuing.'
                  : 'Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects. If you purchase this token, you may not be able to sell it back.'}
        </Message>
        <DialogFooter>
          {tokenSecurity?.isHoneypot ? (
            <Button
              fullWidth
              size="xl"
              variant={isPerps ? 'perps-default' : 'default'}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          ) : (
            <TokenSecurityImportActions
              state={tokenSecurityImportState}
              hasSecurityRisk={hasSecurityRisk}
              onImport={onClick}
              onRetry={() => void refetchTokenSecurity()}
              onCancel={() => setOpen(false)}
              telemetry={{
                tokenSymbol: currency.symbol,
                tokenAddress: currency.address,
              }}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
