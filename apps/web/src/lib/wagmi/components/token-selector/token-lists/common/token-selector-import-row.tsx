import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Message,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { List } from '@sushiswap/ui'
import { type FC, useCallback, useState } from 'react'
import { useTokenSecurity } from 'src/lib/hooks/react-query'
import { EvmChain } from 'sushi/chain'
import { isTokenSecurityChainId } from 'sushi/config'
import type { Token } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'
import { TokenSecurityView } from '../../../token-security-view'

interface TokenSelectorImportRow {
  currency: Token
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

  const honeypot = Boolean(
    tokenSecurity?.is_honeypot?.goPlus || tokenSecurity?.is_honeypot?.deFi,
  )

  return (
    <Dialog onOpenChange={(open) => !open && setOpen(false)}>
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
      {!isTokenSecurityChainId(currency.chainId) || !isTokenSecurityLoading ? (
        <DialogContent className="!flex flex-col max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Import token</DialogTitle>
            <DialogDescription>
              Anyone can create a token, including creating fake versions of
              existing tokens that claim to represent projects. If you purchase
              this token, you may not be able to sell it back.
            </DialogDescription>
          </DialogHeader>
          <List>
            <List.Control>
              <List.KeyValue
                title={
                  <span className="text-gray-900 dark:text-slate-50">Name</span>
                }
              >
                {currency.name}
              </List.KeyValue>
              <List.KeyValue
                title={
                  <span className="text-gray-900 dark:text-slate-50">
                    Symbol
                  </span>
                }
              >
                {currency.symbol}
              </List.KeyValue>
              <List.KeyValue
                title={
                  <span className="text-gray-900 dark:text-slate-50">
                    Address
                  </span>
                }
              >
                <a
                  target="_blank"
                  href={EvmChain.from(currency.chainId)?.getTokenUrl(
                    currency.address,
                  )}
                  className="text-blue"
                  rel="noreferrer"
                >
                  {shortenAddress(currency.address)}
                </a>
              </List.KeyValue>
            </List.Control>
          </List>
          {isTokenSecurityChainId(currency.chainId) ? (
            <div className="flex flex-1 flex-grow flex-col overflow-y-scroll relative pr-4">
              <List className="!pt-0 overflow-hidden">
                <List.Control className="!overflow-y-auto">
                  <TokenSecurityView
                    tokenSecurity={tokenSecurity}
                    isTokenSecurityLoading={isTokenSecurityLoading}
                  />
                </List.Control>
              </List>
            </div>
          ) : null}
          <DialogFooter>
            <div className="flex flex-col gap-3 w-full">
              {!honeypot ? (
                <TraceEvent
                  events={[BrowserEvent.onClick, BrowserEvent.onKeyPress]}
                  name={InterfaceEventName.TOKEN_IMPORTED}
                  properties={{
                    token_symbol: currency?.symbol,
                    token_address: currency?.address,
                  }}
                  element={InterfaceElementName.IMPORT_TOKEN_BUTTON}
                >
                  <Button fullWidth size="xl" onClick={onClick}>
                    I understand
                  </Button>
                </TraceEvent>
              ) : (
                <div className="flex flex-col gap-3">
                  <DialogTrigger asChild>
                    <Button fullWidth size="xl" onClick={() => setOpen(false)}>
                      Close
                    </Button>
                  </DialogTrigger>
                  <Message variant="destructive" size="sm">
                    Sushi does not support honeypot tokens. This token contract
                    cannot be imported!
                  </Message>
                </div>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
