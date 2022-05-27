import { useIsMounted } from '@sushiswap/hooks'
import { Typography } from '@sushiswap/ui'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'
import { useAccount, useConnect } from 'wagmi'

export default function Index() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const connect = useConnect({
    onConnect: () => {
      void router.push('/farms')
    },
  })

  const { isConnected, isReconnecting, isConnecting } = connect
  if (isMounted && (isConnected || isReconnecting || isConnecting)) {
    if (!account?.address) return <></>
  }

  if (isMounted)
    return (
      <Layout>
        <div className="flex flex-col h-full gap-8 pt-40">
          <div className="flex flex-col gap-1">
            <Typography variant="hero" className="text-slate-100 font-stretch" weight={900}>
              Welcome to <span className="text-blue">Onsen</span>
            </Typography>
          </div>
        </div>
      </Layout>
    )

  return null
}
