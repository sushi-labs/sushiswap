import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { useIsMounted } from '@sushiswap/hooks'
import { App, classNames, Container, Menu, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'
import { SUPPORTED_CHAINS } from 'config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useAccount, useConnect } from 'wagmi'

export const Header: FC = () => {
  const isMounted = useIsMounted()
  const { address, isConnected } = useAccount()
  const router = useRouter()

  const connect = useConnect({
    onSuccess: () => {
      void router.push('/dashboard')
    },
  })

  return (
    <div
      className={classNames(router.pathname === '/' ? '' : 'border-b border-slate-800 bg-slate-900', 'relative z-10')}
    >
      <Container maxWidth="5xl" className="px-4 mx-auto">
        <App.Header
          className="h-[54px] z-10"
          brand={
            <Link href={isConnected ? '/dashboard' : '/'} passHref={true}>
              <a>
                <SushiIcon width={32} height={32} className="cursor-pointer" />
              </a>
            </Link>
          }
          nav={<></>}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Wallet.Button className="!h-[36px]" hack={connect} supportedNetworks={SUPPORTED_CHAINS} />
            {address && isMounted && isConnected && (
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
