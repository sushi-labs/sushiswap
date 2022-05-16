import { Menu as HeadlessMenu } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/solid'
import { useIsMounted } from '@sushiswap/hooks'
import { App, classNames, Container, Menu, SushiIcon } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wallet-connector'
import { CreateStreamModal } from 'features/stream'
import CreateVestingModal from 'features/vesting/CreateVestingModal'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useAccount } from 'wagmi'

const Header: FC = () => {
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const router = useRouter()

  return (
    <div
      className={classNames(router.pathname === '/' ? '' : 'border-b border-slate-800 bg-slate-900', 'relative z-10')}
    >
      <Container maxWidth="5xl" className="mx-auto px-2">
        <App.Header
          className="h-[54px] z-10"
          brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
          nav={<></>}
        >
          <div className="flex gap-2 items-center whitespace-nowrap">
            <Wallet.Button />
            {account?.address && isMounted && (
              <Menu
                button={
                  <HeadlessMenu.Button
                    className="w-full !h-[36px] btn !bg-blue btn-blue btn-default !flex gap-1"
                    as="div"
                  >
                    <PlusIcon width={18} />
                    Create
                  </HeadlessMenu.Button>
                }
              >
                <Menu.Items unmount={false} className="!min-w-0">
                  <CreateStreamModal button={<Menu.Item>Stream</Menu.Item>} />
                  <CreateVestingModal button={<Menu.Item>Vesting</Menu.Item>} />
                </Menu.Items>
              </Menu>
            )}
          </div>
        </App.Header>
      </Container>
    </div>
  )
}

export default Header
