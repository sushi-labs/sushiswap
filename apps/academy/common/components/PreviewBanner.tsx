import { Button, Container, Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

interface PreviewBanner {
  show: boolean
}

export const PreviewBanner: FC<PreviewBanner> = ({ show }) => {
  if (!show) return <></>

  return (
    <div className="flex items-center py-3 border-t border-b bg-slate-700 border-slate-600">
      <Container maxWidth="2xl" className="flex items-center justify-between px-4 mx-auto">
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
