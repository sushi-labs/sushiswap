import Image from 'next/image'
import { ChainId } from 'sushi'
import { Providers } from './providers'

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId as ChainId
  return (
    <Providers>
      {chainId === ChainId.KATANA ? <KatanaBackground /> : null}
      {children}
    </Providers>
  )
}

const KatanaBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="/katana-bg-light.jpg"
        alt=""
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover object-left dark:hidden"
      />
      <Image
        src="/katana-bg-dark.jpg"
        alt=""
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover object-left hidden dark:block"
      />
      <div
        className={`
          absolute inset-0
          bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,255,255,0.80)_8.1%,_rgba(255,255,255,0)_100%)]
          dark:bg-[linear-gradient(180deg,_#0F172A_0%,_rgba(15,23,42,0.80)_8.1%,_rgba(15,23,42,0)_100%)]
        `}
      />
    </div>
  )
}
