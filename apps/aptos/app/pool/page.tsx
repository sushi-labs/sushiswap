'use client'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Container from '@sushiswap/ui/future/components/Container'
import { Button } from '@sushiswap/ui/future/components/button'
import { DiscordIcon } from '@sushiswap/ui/future/components/icons'
import Link from 'next/link'
import PoolsSection from '../../components/PoolsSection'
import { Footer } from '@sushiswap/ui/app/Footer'
import { useAccount } from 'utils/useAccount'
import Loading from 'app/loading'
import { useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

export default function Pool() {
  const { isLoadingAccount } = useAccount()
  const { network, disconnect } = useWallet()
  useEffect(() => {
    if (network?.name?.toLowerCase() === undefined) {
      disconnect()
    }
    if (network?.name?.toLowerCase() === 'mainnet' || network?.name?.toLowerCase() === 'devnet') {
      disconnect()
      alert('Please switch network to testnet')
    }
  }, [network])
  return (
    <>
      {isLoadingAccount && <Loading />}
      <Container maxWidth="7xl" className="mx-auto px-4 pt-[80px] lg:pb-[54px]">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-center">
          <div className="flex flex-col items-center flex-grow gap-6 lg:items-start">
            <div className="flex flex-col gap-2">
              <span className="text-center lg:text-left font-semibold text-5xl text-gray-800 dark:text-slate-200 leading-[1.2]">
                Provide Liquidity
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  <br /> and receive fees & rewards<sup className="text-sm top-[-24px]">1</sup>
                </span>
              </span>
            </div>
            <div className="flex items-center">
              <Button
                as="a"
                variant="filled"
                href={`/pool/add/`}
                className="text-xl font-medium -l-full text-blue"
                size="lg"
              >
                Create Position
              </Button>
              {/* <Link href={`/pool/aptos-btc`}>Remove</Link> */}
            </div>
          </div>
          <div className="relative z-10 group">
            <div className="flex flex-col items-center gap-4 lg:items-end">
              <div className="flex flex-col items-center gap-1 lg:items-end">
                <span className="font-semibold lg:text-sm">Looking for a partnership with Sushi?</span>
                <Link
                  href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe"
                  className="font-medium text-blue hover:!text-blue-600 lg:text-sm flex gap-1 items-center"
                >
                  Join Onsen <ChevronRightIcon width={16} height={16} />
                </Link>
              </div>
              <div className="flex flex-col items-center gap-1 lg:items-end">
                <span className="font-semibold lg:text-sm">Need Help?</span>
                <Link
                  href="https://discord.gg/NVPXN4e"
                  className="font-medium text-blue hover:!text-blue-600 lg:text-sm flex gap-1 items-center"
                >
                  <DiscordIcon width={16} height={16} /> Join our discord
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <PoolsSection />
      {/* <PoolFilters /> */}
      <Footer />
    </>
  )
}
