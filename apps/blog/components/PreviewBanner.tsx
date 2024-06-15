import { LinkInternal } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import type { FC } from 'react'

interface PreviewBanner {
  show: boolean
}

export const PreviewBanner: FC<PreviewBanner> = ({ show }) => {
  if (!show) return <></>

  return (
    <div className="bg-slate-700 py-3 flex items-center border-t border-slate-600 border-b">
      <Container
        className="mx-auto px-4 flex items-center justify-between"
        maxWidth="2xl"
      >
        <div className="flex flex-col gap-1">
          <span className="font-medium text-white">Preview Mode</span>
          <span className="text-xs text-slate-300">
            You are viewing an unpublished article
          </span>
        </div>
        <Button asChild>
          <LinkInternal href="/api/exit-preview">
            Exit Preview Mode
          </LinkInternal>
        </Button>
      </Container>
    </div>
  )
}
