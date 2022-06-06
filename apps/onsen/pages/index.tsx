import { useIsMounted } from '@sushiswap/hooks'
import { Button, Typography } from '@sushiswap/ui'
import Layout from 'components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount, useConnect, useNetwork } from 'wagmi'

export default function Index() {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
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
            {activeChain ? (
              <Link passHref={true} href={`/farms?chainId=${activeChain?.id}`}>
                <Button className="transition-all hover:ring-4 btn btn-blue btn-filled btn-default text-sm sm:text-base text-slate-50 px-8 h-[52px] sm:!h-[56px] rounded-2xl">
                  View farms
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Layout>
    )

  return null
}
