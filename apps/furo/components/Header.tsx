import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { useIsMounted } from '@sushiswap/hooks'
import { App, classNames, Container, Menu, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useAccount, useConnect } from 'wagmi'

export const Header: FC = () => {
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const { isConnected } = useConnect()
  const router = useRouter()

  return (
    <div
      className={classNames(router.pathname === '/' ? '' : 'border-b border-slate-800 bg-slate-900', 'relative z-10')}
    >
      <Container maxWidth="5xl" className="px-4 mx-auto">
        <App.Header
          className="h-[54px] z-10"
          brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
          nav={<></>}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Wallet.Button className="!h-[36px]" />
            {account?.address && isMounted && isConnected && (
              <Menu
                button={
                  <Menu.Button
                    color="blue"
                    fullWidth
                    startIcon={<PaperAirplaneIcon width={18} className="transform rotate-45 -mt-0.5" />}
                    className="!h-[36px]"
                    as="div"
                  >
                    Pay Someone
                  </Menu.Button>
                }
              >
                <Menu.Items unmount={false} className="!min-w-0">
                  <Link passHref={true} href="/stream/create">
                    <Menu.Item as="a">Stream</Menu.Item>
                  </Link>
                  <Link passHref={true} href="/vesting/create">
                    <Menu.Item as="a">Vesting</Menu.Item>
                  </Link>
                </Menu.Items>
              </Menu>
            )}
          </div>
        </App.Header>
      </Container>
    </div>
  )
}
