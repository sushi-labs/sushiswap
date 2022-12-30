import { Button, Container, Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

interface PreviewBanner {
  show: boolean
}

export const PreviewBanner: FC<PreviewBanner> = ({ show }) => {
  if (!show) return <></>

  return (
    <div className="bg-slate-700 py-3 flex items-center border-t border-slate-600 border-b">
      <Container maxWidth="2xl" className="mx-auto px-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Typography variant="base" weight={500} className="text-white">
            Preview Mode
          </Typography>
          <Typography variant="xs" className="text-slate-300">
            You are viewing an unpublished article
          </Typography>
        </div>
        <Link passHref={true} href="/api/exit-preview" legacyBehavior>
          <Button as="a" color="blue" size="sm" className="px-6">
            Exit Preview Mode
          </Button>
        </Link>
      </Container>
    </div>
  )
}
