import { ExclamationTriangleIcon, LinkIcon, PlusIcon } from '@heroicons/react/24/outline'
import chain from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { SlideIn } from '@sushiswap/ui13/components/animation'
import { Button } from '@sushiswap/ui13/components/button'
import { Icon } from '@sushiswap/ui13/components/currency/Icon'
import { List } from '@sushiswap/ui13/components/list/List'
import { Overlay } from '@sushiswap/ui13/components/overlay'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'

interface TokenSelectorImportRow {
  currencies: (Token | undefined)[]
  onImport(): void
  slideIn?: boolean
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRow> = ({ currencies, onImport, slideIn = true }) => {
  const [open, setOpen] = useState<boolean>(false)

  const onClick = useCallback(() => {
    onImport()

    setTimeout(() => {
      setOpen(false)
    }, 250)
  }, [onImport])

  const content = useMemo(
    () => (
      <div className="space-y-3 my-3">
        <div className="rounded-2xl p-3 flex flex-col gap-2 items-center">
          <ExclamationTriangleIcon width={26} height={26} className="text-red" />
          <span className="font-medium text-lg text-gray-900 dark:text-slate-200">Trade at your own risk!</span>
          <span className="text-sm text-gray-600 dark:text-slate-400 text-center">
            {currencies.length > 1 ? "These tokens don't" : "This token doesn't"} appear on the active token list(s).
            Anyone can create a token, including creating fake versions of existing tokens that claim to represent
            projects
          </span>
        </div>
        <List>
          <List.Control>
            {currencies.reduce<ReactNode[]>((acc, cur) => {
              if (cur) {
                acc.push(
                  <List.MenuItem
                    as="a"
                    href={chain[cur.chainId].getTokenUrl(cur.wrapped.address)}
                    target="_blank"
                    icon={Icon}
                    iconProps={{ currency: cur, width: 28, height: 28 }}
                    title={cur.symbol || ''}
                    hoverIcon={LinkIcon}
                    hoverIconProps={{
                      width: 20,
                      height: 20,
                      className: 'text-blue',
                    }}
                  />
                )
              }

              return acc
            }, [])}
          </List.Control>
        </List>
        <div className="absolute bottom-3 left-3 right-3">
          <Button fullWidth size="xl" variant="outlined" color="blue" onClick={onClick}>
            Import
          </Button>
        </div>
      </div>
    ),
    [currencies, onImport]
  )

  return (
    <>
      {slideIn && currencies[0] ? (
        <>
          <List.MenuItem
            className="!px-2 rounded-xl hover:!bg-white hover:dark:!bg-slate-800"
            icon={Icon}
            iconProps={{ currency: currencies[0], width: 28, height: 28 }}
            title={currencies[0].symbol || ''}
            onClick={() => setOpen(true)}
            hoverIcon={PlusIcon}
          />
          <SlideIn.FromRight show={open} onClose={() => setOpen(false)}>
            <Overlay.Content className="bg-white dark:bg-slate-800 !pb-0">
              <Overlay.Header onBack={() => setOpen(false)} title="" />
              {content}
            </Overlay.Content>
          </SlideIn.FromRight>
        </>
      ) : (
        content
      )}
    </>
  )
}
