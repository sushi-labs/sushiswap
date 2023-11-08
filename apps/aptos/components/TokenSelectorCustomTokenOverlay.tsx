import { TrashIcon } from '@heroicons/react/24/outline'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { List } from '@sushiswap/ui'
import React, { useMemo, useState } from 'react'
import { Token } from 'utils/tokenType'
import { useCustomTokens } from 'utils/useCustomTokens'

export const TokenSelectorCustomTokenOverlay = () => {
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
      <Button
        className="rounded-full"
        color="blue"
        size="xs"
        onClick={() => setOpen(true)}
      >
        Manage
      </Button>
      <SlideIn.FromRight
        show={open}
        onClose={() => setOpen(false)}
        className="!mt-0"
      >
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
                    subtitle={'APTOS'}
                    onClick={() => mutate('remove', [token])}
                    hoverIcon={TrashIcon}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-xs flex text-slate-500 py-10">
                    No custom tokens found
                  </span>
                </div>
              )}
            </List.Control>
          </List>
        </Overlay.Content>
      </SlideIn.FromRight>
    </>
  )
}
