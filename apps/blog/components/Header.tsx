import { App, Button, Container, SushiIcon, Typography } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import { FC } from 'react'

export const Header: FC = () => {
  const router = useRouter()

  return (
    <div className="border-b border-slate-800 bg-slate-900 relative z-10">
      <Container maxWidth="5xl" className="px-4 mx-auto">
        <App.Header
          className="h-[54px] z-10"
          brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
          nav={<></>}
        >
          <div className="flex items-center gap-9 whitespace-nowrap">
            <Typography variant="sm" weight={700} className="cursor-pointer">
              Blog
            </Typography>
            <Typography variant="sm" className="cursor-pointer">
              Vote
            </Typography>
            <Typography variant="sm" className="cursor-pointer">
              FAQ
            </Typography>
            <Button color="gradient" size="sm">
              Enter App
            </Button>
          </div>
        </App.Header>
      </Container>
    </div>
  )
}
