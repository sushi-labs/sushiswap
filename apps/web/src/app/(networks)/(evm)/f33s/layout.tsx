import { EvmChainId } from 'sushi/evm'
import { Header } from '~evm/[chainId]/header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header chainId={EvmChainId.ETHEREUM} />
      <div className="flex flex-col flex-1 overflow-y-auto animate-slide">
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-9 pb-10 h-full">
            {children}
          </div>
        </section>
      </div>
    </>
  )
}
