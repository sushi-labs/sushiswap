import type { Metadata } from 'next'
import { CROSSMINT_CLIENT_SIDE_API_KEY } from 'src/lib/crossmint'
import { CrossmintBuyFlow } from './components/crossmint-buy-flow'

export const metadata: Metadata = {
  title: 'Buy Crypto',
  description: 'Buy tokens with card, Apple Pay, or Google Pay.',
}

export default function BuyPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-10 sm:py-16">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-blue">
          Crossmint staging
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Buy with fiat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Embedded card and one-tap checkout for memecoins, plus stablecoin
          onramp to your external wallet.
        </p>
      </div>

      {CROSSMINT_CLIENT_SIDE_API_KEY ? (
        <CrossmintBuyFlow />
      ) : (
        <div role="alert" className="rounded-xl border border-accent p-6">
          Crossmint is not configured. Set the client and server environment
          variables to enable this staging flow.
        </div>
      )}

      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        Apple Pay requires a public HTTPS domain registered in the Crossmint
        staging console. The client key origin allowlist must also include this
        site.
      </p>
    </main>
  )
}
