import { FC } from 'react'
import { Button } from '@sushiswap/ui/components/button'
import { Container } from '@sushiswap/ui/components/container'

interface PreviewBanner {
  show: boolean
}

export const PreviewBanner: FC<PreviewBanner> = ({ show }) => {
  if (!show) return <></>

  return (
    <div className="bg-slate-700 py-3 flex items-center border-t border-slate-600 border-b">
      <Container maxWidth="2xl" className="mx-auto px-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-white">Preview Mode</span>
          <span className="text-xs text-slate-300">You are viewing an unpublished article</span>
        </div>
        <Button>
          <a href="/api/exit-preview">Exit Preview Mode</a>
        </Button>
      </Container>
    </div>
  )
}
