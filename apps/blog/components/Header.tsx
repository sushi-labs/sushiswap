import { App, SushiIcon } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import { FC } from 'react'

export const Header: FC = () => {
  const router = useRouter()

  return (
    <App.Header
      className="bg-slate-900 border-b border-slate-200/5"
      brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
      nav={<></>}
    >
      <div className="flex items-center gap-9 whitespace-nowrap">
        {/*<Button color="gradient" size="sm" className="rounded-full text-slate-50">*/}
        {/*  Enter App*/}
        {/*</Button>*/}
      </div>
    </App.Header>
  )
}
