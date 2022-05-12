import { Wallet } from '@sushiswap/wallet-connector'
import { useIsMounted } from '@sushiswap/hooks'
import { useConnect } from 'wagmi'
import Layout from 'components/Layout'
import { Typography } from '@sushiswap/ui'
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/router'

export default function Index() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const connect = useConnect({
    onConnect: () => {
      void router.push('/dashboard')
    },
  })

  const { isConnecting, isConnected, pendingConnector, isReconnecting } = connect
  const loading = !!pendingConnector && isConnecting
  if ((!isMounted || isConnected) && !loading && !isReconnecting) {
    return <></>
  }

  return (
    <Layout>
      <div className="flex flex-col h-full gap-8 pt-40">
        <div className="flex flex-col gap-1">
          <Typography variant="hero" className="text-white font-stretch" weight={700}>
            Welcome to <span className="text-blue">Furo</span>
          </Typography>
          <Typography variant="h3">Decentralized asset streaming on steroids.</Typography>
        </div>
        <div className="flex gap-4">
          <Wallet.Button
            hack={connect}
            button={
              <Menu.Button
                className="transition-all hover:ring-4 ring-blue-800 btn btn-blue btn-filled btn-default w-full text-base px-10 !h-[56px] rounded-2xl"
                as="div"
              >
                Connect Wallet
              </Menu.Button>
            }
          />
          <Wallet.Button
            hack={connect}
            button={
              <Menu.Button
                className="transition-all hover:ring-4 ring-gray-700 btn bg-gray-600 btn-filled btn-default w-full text-base px-10 !h-[56px] rounded-2xl"
                as="div"
              >
                View Address
              </Menu.Button>
            }
          />
        </div>
      </div>
    </Layout>
  )
}
