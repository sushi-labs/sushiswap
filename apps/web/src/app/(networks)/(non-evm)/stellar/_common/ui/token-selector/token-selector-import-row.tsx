import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  List,
} from '@sushiswap/ui'
import React, { type FC, useCallback, useState } from 'react'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { formatAddress } from '~stellar/_common/lib/utils/format'
import { getStellarContractLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { TokenIcon } from '../General/TokenIcon'

interface TokenSelectorImportRow {
  token: Token
  onImport(): void
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRow> = ({
  token,
  onImport,
}) => {
  const [, setOpen] = useState<boolean>(false)

  const onClick = useCallback(() => {
    onImport()

    setTimeout(() => {
      setOpen(false)
    }, 250)
  }, [onImport])

  return (
    <Dialog>
      <div className="relative py-0.5 h-[64px]">
        <div className="flex items-center w-full hover:bg-muted focus:bg-accent h-full rounded-lg px-3">
          <div className="flex flex-row items-center flex-grow gap-4">
            <div className="w-10 h-10">
              <TokenIcon currency={token} height={40} width={40} />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 dark:group-hover:text-white">
                {token.code}
              </span>
              <span className="max-w-[200px] truncate text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100 text-ellipsis overflow-clip">
                {token.name}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <DialogTrigger asChild>
              <Button size="xs">Import</Button>
            </DialogTrigger>
          </div>
        </div>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import token</DialogTitle>
          <DialogDescription>
            Trade at your own risk! This token doesn&apos;t appear on the active
            token list(s). Anyone can create a token, including creating fake
            versions of existing tokens that claim to represent projects.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <List className="!pt-0">
            <List.Control>
              <div className="flex items-center gap-4 py-2 px-4">
                <TokenIcon currency={token} width={40} height={40} />
                <div className="flex flex-col gap-1">
                  <span className="truncate font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                    {token.code}
                  </span>
                  <a
                    target="_blank"
                    href={getStellarContractLink(token.contract)}
                    className="flex gap-1 text-sm text-blue font-medium"
                    rel="noreferrer"
                  >
                    {formatAddress(token.contract)}
                  </a>
                </div>
              </div>
            </List.Control>
          </List>
        </div>
        <DialogFooter>
          <div className="flex flex-col gap-3 w-full">
            <Button fullWidth size="xl" onClick={onClick}>
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
