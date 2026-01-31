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
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/UnknownTokenIcon'
import { type FC, useCallback, useState } from 'react'
import { useTokenSecurity } from 'src/lib/hooks/react-query'
import { getChainById, shortenAddress } from 'sushi'
import {
  type EvmAddress,
  type EvmToken,
  getEvmChainById,
} from 'sushi/evm'
import type { SvmToken } from 'sushi/svm'
import { TokenSecurityView } from '../../../token-security-view'

interface TokenSelectorImportRow {
  currency: EvmToken | SvmToken
  onImport(): void
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRow> = ({
  currency,
  onImport,
}) => {
  const [open, setOpen] = useState(false)

  const { data: tokenSecurity, isLoading: isTokenSecurityLoading } =
    useTokenSecurity({
      currency,
      enabled: open,
    })

  const onClick = useCallback(() => {
    onImport()

    setTimeout(() => {
      setOpen(false)
    }, 250)
  }, [onImport])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative py-0.5 h-[64px]">
        <div className="flex items-center w-full hover:bg-muted focus:bg-accent h-full rounded-lg px-3">
          <div className="flex flex-row items-center flex-grow gap-4">
            <div className="w-10 h-10">
              <Currency.Icon
                disableLink
                currency={currency}
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 dark:group-hover:text-white">
                {currency.symbol}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                {currency.name}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <DialogTrigger asChild>
              <Button size="xs" onClick={() => setOpen(true)}>
                Import
              </Button>
            </DialogTrigger>
          </div>
        </div>
      </div>
      <DialogContent className="!flex flex-col max-h-[80vh]" hideClose>
        <DialogHeader className="!text-left !space-y-3">
          <DialogTitle>
            <div
              className={classNames(
                'inline-flex items-center px-2 py-1.5 gap-1 rounded-full',
                isTokenSecurityLoading
                  ? 'bg-muted'
                  : tokenSecurity?.isHoneypot ||
                      tokenSecurity?.isFoT ||
                      tokenSecurity?.isRisky
                    ? 'bg-red/20 text-red'
                    : 'bg-yellow/20 text-yellow',
              )}
            >
              {isTokenSecurityLoading ? (
                <div className="w-7 h-7 flex justify-center items-center">
                  <Loader width={28} height={28} />
                </div>
              ) : tokenSecurity?.isHoneypot ||
                tokenSecurity?.isFoT ||
                tokenSecurity?.isRisky ? (
                <ExclamationTriangleIcon width={28} height={28} />
              ) : (
                <ExclamationCircleIcon width={28} height={28} />
              )}
            </div>
          </DialogTitle>
          {isTokenSecurityLoading ? (
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
        <List>
          <List.Control className="!p-4">
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
                  // Ugly cast to satisfy both EvmToken and SvmToken
                  currency.address as EvmAddress,
                )}
                className="font-medium"
              >
                {shortenAddress(currency.address)}{' '}
              </LinkExternal>
            </div>
          </List.Control>
        </List>
        <List className="!pt-0 overflow-hidden">
          <List.Control className="!overflow-y-auto flex flex-col gap-3 p-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Token Security Scan
              </span>
            </div>
            <TokenSecurityView
              token={currency}
              tokenSecurity={tokenSecurity}
              isTokenSecurityLoading={isTokenSecurityLoading}
            />
          </List.Control>
        </List>
        <Message
          size="sm"
          variant={
            tokenSecurity?.isHoneypot ||
            tokenSecurity?.isFoT ||
            tokenSecurity?.isRisky
              ? 'destructive'
              : 'warning'
          }
        >
          {tokenSecurity?.isHoneypot
            ? 'Honeypot tokens restrict selling. Sushi does not support this token type.'
            : tokenSecurity?.isFoT
              ? 'This token charges a tax fee on transfer. Tax tokens are not supported in V3. You might not be able to trade, transfer, or withdraw liquidity of this token.'
              : tokenSecurity?.isRisky
                ? 'Our security scan has identified risks associated with this token. Proceeding may result in the loss of your funds. Please exercise caution and review the details before continuing.'
                : 'Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects. If you purchase this token, you may not be able to sell it back.'}
        </Message>
        <DialogFooter>
          {tokenSecurity?.isHoneypot ? (
            <Button fullWidth size="xl" onClick={() => setOpen(false)}>
              Close
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <TraceEvent
                events={[BrowserEvent.onClick, BrowserEvent.onKeyPress]}
                name={InterfaceEventName.TOKEN_IMPORTED}
                properties={{
                  token_symbol: currency?.symbol,
                  token_address: currency?.address,
                }}
                element={InterfaceElementName.IMPORT_TOKEN_BUTTON}
              >
                <Button
                  fullWidth
                  size="xl"
                  onClick={onClick}
                  variant={
                    tokenSecurity?.isFoT || tokenSecurity?.isRisky
                      ? 'destructive'
                      : 'default'
                  }
                >
                  {tokenSecurity?.isFoT || tokenSecurity?.isRisky
                    ? 'Import Anyways'
                    : 'Confirm Import'}
                </Button>
              </TraceEvent>
              <Button
                fullWidth
                size="xl"
                onClick={() => setOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
