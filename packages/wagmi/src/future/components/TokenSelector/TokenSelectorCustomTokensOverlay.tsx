import { TrashIcon } from '@heroicons/react/24/outline'
import chains from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useCustomTokens, useIsMounted } from '@sushiswap/hooks'
import { SlideIn } from '@sushiswap/ui/components/animation'
import { List } from '@sushiswap/ui/components/list/List'
import { Overlay } from '@sushiswap/ui/components/overlay'
import React, { FC, useMemo, useState } from 'react'
import { Button } from '@sushiswap/ui/components/button'

export const TokenSelectorCustomTokensOverlay: FC = () => {
  const isMounted = useIsMounted()
  const { data: customTokens, mutate } = useCustomTokens()

  const [open, setOpen] = useState<boolean>(false)

  const [, tokens] = useMemo(() => {
    const ids: string[] = []
    const tokens: Token[] = []
    if (customTokens) {
      Object.entries(customTokens).forEach(([k, v]) => {
        ids.push(k)
        tokens.push(v)
      })
    }

    return [ids, tokens]
  }, [customTokens])

  if (!isMounted) return <></>

  return (
    <>
      <Button className="rounded-full"  size="sm" onClick={() => setOpen(true)}>
        Manage
      </Button>
      <SlideIn.FromRight show={open} onClose={() => setOpen(false)} className="!mt-0">
        <Overlay.Content>
          <Overlay.Header onBack={() => setOpen(false)} title="Custom Tokens" />
          <List>
            <List.Label>Tokens</List.Label>
            <List.Control>
              {tokens.length > 0 ? (
                tokens.map((token) => (
                  <List.MenuItem
                    key={token.address}
                    title={token.symbol || ''}
                    subtitle={chains[token.chainId]?.name}
                    onClick={() => mutate('remove', [token.wrapped])}
                    hoverIcon={TrashIcon}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-xs flex text-slate-500 py-10">No custom tokens found</span>
                </div>
              )}
            </List.Control>
          </List>
        </Overlay.Content>
      </SlideIn.FromRight>
    </>
  )
}
